const compiler = require("vue-template-compiler");
const fs = require("fs");

const { VueLoaderPlugin } = require("vue-loader");

module.exports = (config) => {
  const babelRule = config.module.rule("babel");
  const vueRule = config.module.rule("vue");

  vueRule.test(/\.vue$/);
  vueRule.exclude.add(/node_modules/);
  vueRule.use("vue-loader").loader(require.resolve("vue-loader"));

  config.plugin("vue-loader-plugin").use(VueLoaderPlugin);

  babelRule.use("babel-loader").tap((options) => {
    if (options.overrides == null) {
      options.overrides = [];
    }

    options.overrides.push({
      plugins: [require.resolve("@babel/plugin-transform-typescript")],
      test(filePath) {
        if (filePath.endsWith(".vue")) {
          const { script } = compiler.parseComponent(
            fs.readFileSync(filePath, "utf8")
          );

          if (script && script.lang) {
            return script.lang.toLowerCase() === "ts";
          }
        }

        return false;
      },
    });

    return options;
  });

  const typescriptPlugin = config.plugin("typescript-plugin");

  if (typescriptPlugin) {
    const ts = require("typescript");

    const getExtensionByLang = (lang) => {
      if (typeof lang === "string") {
        lang = lang.toLowerCase();
      }

      switch (lang) {
        case "ts":
          return ".ts";

        case "tsx":
          return ".tsx";

        case "jsx":
          return ".jsx";
      }

      return ".js";
    };

    const getEmbeddedContent = (sourceText, { end, src, start }) => {
      if (src) {
        src = src.replace(/\.tsx?$/i, "");

        const lines = [
          `export { default } from "${src}";`,
          `export * from "${src}";`,
        ];

        return lines.join(ts.sys.newLine);
      }

      return (
        Array(sourceText.slice(0, start).split(/\r?\n/g).length).join(
          ts.sys.newLine
        ) + sourceText.slice(start, end)
      );
    };

    typescriptPlugin.tap(([options = {}]) => {
      if (options.embeddedParsers == null) {
        options.embeddedParsers = [];
      }

      options.embeddedParsers.push({
        test: /\.vue$/,
        parse(fileName, sourceText) {
          const { script } = compiler.parseComponent(sourceText, {
            pad: "space",
          });

          return (
            script && {
              content: getEmbeddedContent(sourceText, script),
              extension: getExtensionByLang(script.lang),
              fileName,
            }
          );
        },
      });

      return [options];
    });
  }

  config.resolve.extensions.add(".vue");
};
