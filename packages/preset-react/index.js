const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = (options) => (config, context) => {
  const babelRule = config.module.rule("babel");

  babelRule.use("babel-loader").tap((loaderOptions) => {
    loaderOptions.presets.push([
      require.resolve("@babel/preset-react"),
      options,
    ]);

    if (context.isWatching) {
      loaderOptions.plugins.push(require.resolve("react-refresh/babel"));
    }

    return loaderOptions;
  });

  if (context.isWatching) {
    config.plugin("react-refresh-plugin").use(ReactRefreshWebpackPlugin);
  }
};
