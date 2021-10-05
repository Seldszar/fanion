const fanion = require("@fanion/webpack");

module.exports = fanion({
  variants: {
    extension: {
      source: "src/extension/index.ts",
    },
    dashboard: {
      source: "src/browser/dashboard/views/*.tsx",
      template: "src/browser/dashboard/template.html",
      use: require("@fanion/preset-react"),
    },
    graphics: {
      source: "src/browser/graphics/views/*.tsx",
      template: "src/browser/graphics/template.html",
      use: require("@fanion/preset-react"),
    },
  },
});
