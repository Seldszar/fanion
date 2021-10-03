# @fanion/webpack

> Yet another opiniated Webpack configuration for NodeCG bundles

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Author](#author)
- [License](#license)

# Install

```bash
$ npm install @fanion/webpack
```

# Usage

Create a new file called `webpack.config.js` and write the configuration you need.

Here's an example using Vue.js with the following file structure:

```
src/
├── dashboard/
|   └── views/
|   |   ├── lorem/
|   |   |   ├── App.vue
|   |   |   └── index.ts
|   |   └── ipsum/
|   |       ├── App.vue
|   |       └── index.ts
|   └── template.html
├── extension/
|   └── index.ts
└── graphics/
    ├── views/
    |   ├── lorem/
    |   |   ├── App.vue
    |   |   └── index.ts
    |   └── ipsum/
    |       ├── App.vue
    |       └── index.ts
    └── template.html
```

```javascript
const fanion = require("@fanion/webpack");

module.exports = fanion({
  variants: {
    extension: {
      source: "src/extension/index.ts",
    },
    dashboard: {
      source: "src/browser/dashboard/views/*/index.ts",
      template: "src/browser/dashboard/template.html",
      use: require("@fanion/preset-vue"),
    },
    graphics: {
      source: "src/browser/graphics/views/*/index.ts",
      template: "src/browser/graphics/template.html",
      use: require("@fanion/preset-vue"),
    },
  },
});
```

## API

See the [declaration file](./index.d.ts).

## Author

Alexandre Breteau - [@0xSeldszar](https://twitter.com/0xSeldszar)

## License

MIT © [Alexandre Breteau](https://seldszar.fr)
