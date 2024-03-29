const fanion = require("@fanion/webpack");

const { EntryWrapperPlugin } = require("@seldszar/yael");

module.exports = fanion({
  variants: {
    extension: {
      source: "src/extension/index.ts",
    },
    dashboard: {
      source: "src/browser/dashboard/views/*.vue",
      template: "src/browser/dashboard/template.html",
      use: require("@fanion/preset-vue-next"),
    },
    graphics: {
      source: "src/browser/graphics/views/*.vue",
      template: "src/browser/graphics/template.html",
      use: require("@fanion/preset-vue-next"),
    },
  },
  webpack(config, { name }) {
    if (name === "extension") {
      return;
    }

    config.plugin("entry-wrapper-plugin").use(EntryWrapperPlugin, [
      {
        template: `src/browser/${name}/template.ts`,
        test: /\.vue$/,
      },
    ]);
  },
});
