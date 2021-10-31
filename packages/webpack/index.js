const dotProp = require("dot-prop");
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const Config = require("webpack-chain");
const nodeExternals = require("webpack-node-externals");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const AliasResolvePlugin = require("./plugins/alias-resolve");
const EntryPlugin = require("./plugins/entry");
const PagePlugin = require("./plugins/page");
const RefreshPlugin = require("./plugins/refresh");
const TypescriptPlugin = require("./plugins/typescript");

const loadJsonFile = (filePath) => JSON.parse(fs.readFileSync(filePath));
const castArray = (value) => (Array.isArray(value) ? value : [value]);

module.exports = (options) => {
  const { dependencies, devDependencies } = loadJsonFile("package.json");

  /**
   * @param {...string} names
   */
  const useDependency = (...names) =>
    names.some((name) => name in dependencies || name in devDependencies);

  const usePostcss = useDependency("postcss");
  const useSass = useDependency("sass", "node-sass");
  const useTypescript = useDependency("typescript");

  /**
   * @param {Config.Rule} config
   * @param {boolean} modules
   * @param {string[]} loaders
   */
  const applyStyleRule = (config, modules, loaders = []) => {
    if (usePostcss) {
      loaders.unshift(require.resolve("postcss-loader"));
    }

    config
      .use("extract-css-loader")
      .loader(MiniCssExtractPlugin.loader)
      .options({
        esModule: false,
      });

    config.use("css-loader").loader(require.resolve("css-loader")).options({
      importLoaders: loaders.length,
      modules,
    });

    loaders.forEach((loader) => {
      config.use(loader).loader(require.resolve(loader));
    });
  };

  return (_, argv) => {
    const result = [];

    const isProduction = argv.mode === "production";
    const isWatching = argv.watch;

    const variantEntries = Object.entries(options.variants);

    for (const [variantName, variantOptions] of variantEntries) {
      const config = new Config();

      config
        .name(variantName)
        .devtool(isProduction ? "source-map" : "eval-source-map");

      config.performance.set("hints", false);

      config.output.path(path.resolve(variantName)).set("clean", isProduction);

      config.resolve.extensions.merge([
        ".wasm",
        ".mjs",
        ".jsx",
        ".js",
        ".json",
      ]);

      config.cache({
        type: "filesystem",
        compression: false,
        buildDependencies: {
          config: [__filename, require.main.filename],
        },
      });

      config.set("infrastructureLogging", {
        level: "error",
      });

      config.watchOptions({
        aggregateTimeout: 500,
        ignored: [".git", "node_modules", "dashboard", "extension", "graphics"],
      });

      config.optimization.splitChunks({
        cacheGroups: {
          vendor: {
            name: "vendor",
            chunks: "initial",
            test: /node_modules/,
          },
        },
      });

      config.optimization
        .minimizer("terser-webpack-plugin")
        .use(TerserWebpackPlugin, [
          {
            extractComments: false,
            terserOptions: {
              format: {
                comments: false,
              },
            },
          },
        ]);

      try {
        const { compilerOptions: options } = loadJsonFile("jsconfig.json");

        config.resolve
          .plugin("jsconfig-alias-resolve-plugin")
          .use(AliasResolvePlugin, [
            {
              baseUrl: path.resolve(options.baseUrl || "."),
              paths: options.paths,
            },
          ]);
      } catch {} // eslint-disable-line no-empty

      const babelRule = config.module.rule("babel");

      babelRule.test(/\.[jt]sx?$/);
      babelRule.exclude.add(/node_modules/);

      babelRule
        .use("thread-loader")
        .loader(require.resolve("thread-loader"))
        .options({
          workers: 2,
          workerParallelJobs: Infinity,
          poolTimeout: isWatching ? Infinity : 500,
        });

      babelRule
        .use("babel-loader")
        .loader(require.resolve("babel-loader"))
        .options({
          cacheDirectory: true,
          cacheCompression: false,
          configFile: dotProp.get(variantOptions, "babel.configFile"),
          plugins: [
            [
              "@babel/plugin-proposal-decorators",
              {
                legacy: true,
              },
            ],
            [
              "@babel/plugin-proposal-class-properties",
              {
                loose: false,
              },
            ],
            [
              "@babel/plugin-transform-runtime",
              {
                corejs: false,
                helpers: true,
                regenerator: true,
              },
            ],
          ],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: variantName === "extension" ? "node 12" : "chrome 75",
                include: [
                  "@babel/plugin-proposal-optional-chaining",
                  "@babel/plugin-proposal-nullish-coalescing-operator",
                ],
              },
            ],
            [
              "@babel/preset-typescript",
              {
                optimizeConstEnums: true,
                allExtensions: true,
                isTSX: true,
              },
            ],
          ],
        });

      if (useTypescript) {
        const configFile = path.resolve(
          dotProp.get(variantOptions, "typescript.configFile", "tsconfig.json")
        );

        const result = TypescriptPlugin.parseConfigFile(configFile);

        if (result) {
          const { basePath, options } = result;

          config.resolve
            .plugin("tsconfig-alias-resolve-plugin")
            .use(AliasResolvePlugin, [
              {
                baseUrl: path.resolve(basePath, options.baseUrl || "."),
                paths: options.paths,
              },
            ]);
        }

        config
          .plugin("typescript-plugin")
          .use(TypescriptPlugin, [{ configFile }]);

        config.resolve.extensions.merge([".tsx", ".ts"]);
      }

      switch (variantName) {
        case "dashboard":
        case "graphics": {
          config.target("web");

          const cssRule = config.module.rule("css").test(/\.css$/);

          applyStyleRule(cssRule.oneOf("module").resourceQuery(/module/), true);
          applyStyleRule(cssRule.oneOf("normal"), false);

          applyStyleRule(
            config.module.rule("css-modules").test(/\.module\.css$/),
            true
          );

          if (useSass) {
            const sassRule = config.module.rule("sass").test(/\.s[ac]ss$/);

            applyStyleRule(
              sassRule.oneOf("module").resourceQuery(/module/),
              true,
              ["sass-loader"]
            );
            applyStyleRule(sassRule.oneOf("normal"), false, ["sass-loader"]);

            applyStyleRule(
              config.module.rule("sass-modules").test(/\.module\.s[ac]ss$/),
              true,
              ["sass-loader"]
            );
          }

          config.module
            .rule("assets")
            .test(/\.(png|jpe?g|gif|svg|eot|ttf|woff2?|web[mp])$/)
            .type("asset/resource");

          config.plugin("mini-css-extract-plugin").use(MiniCssExtractPlugin);
          config.plugin("node-polyfill-webpack-plugin").use(NodePolyfillPlugin);

          let template = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
              </head>
            </html>
          `;

          if (variantOptions.template) {
            template = fs.readFileSync(variantOptions.template, "utf-8");
          }

          config.plugin("page-plugin").use(PagePlugin, [
            {
              pages: {
                hash: true,
                template,
              },
            },
          ]);

          if (isWatching) {
            config.plugin("refresh-plugin").use(RefreshPlugin);
          }

          break;
        }

        case "extension": {
          config.target("node").externals(nodeExternals());

          config.output.set("library", {
            type: "commonjs2",
          });

          if (config.get("devtool") && "source-map-support" in dependencies) {
            config
              .plugin("source-map-banner-plugin")
              .use(webpack.BannerPlugin, [
                {
                  banner: `require("source-map-support/register");`,
                  entryOnly: true,
                  raw: true,
                },
              ]);
          }

          break;
        }
      }

      config.plugin("entry-plugin").use(EntryPlugin, [
        {
          source: variantOptions.source,
          format(name, entry) {
            entry = [entry];

            if (config.get("target") === "web" && isWatching) {
              entry.unshift(require.resolve("./plugins/refresh/client"));
            }

            return [name, entry];
          },
        },
      ]);

      const handlers = castArray(variantOptions.use || []).map((value) => {
        switch (typeof value) {
          case "function":
            return value({});

          case "object":
            return value.preset(value.options || {});

          default:
            throw new RangeError("Unknown preset format");
        }
      });

      if (options.webpack) {
        handlers.push(options.webpack);
      }

      handlers.forEach((handler) => {
        handler(config, {
          options: variantOptions,
          name: variantName,
          isProduction,
          isWatching,
        });
      });

      result.push({ entry: {}, ...config.toConfig() });
    }

    return result;
  };
};
