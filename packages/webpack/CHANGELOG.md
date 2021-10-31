# @fanion/webpack

## 1.4.3

### Patch Changes

- [`e8f072c`](https://github.com/Seldszar/fanion/commit/e8f072cb042831c3d3f277596bcd959974697398) Thanks [@Seldszar](https://github.com/Seldszar)! - Updated the Webpack Node.js externals to bundle default dependencies if they aren't defined in `package.json`.

## 1.4.2

### Patch Changes

- [`3ce218c`](https://github.com/Seldszar/fanion/commit/3ce218c15f28e3081be041a53ee01944fc2963ad) Thanks [@Seldszar](https://github.com/Seldszar)! - Apply the `source-map-support` banner only if the package is included as production dependency.

## 1.4.1

### Patch Changes

- [`30c698c`](https://github.com/Seldszar/fanion/commit/30c698c7924a58f9345f227ceabf73a6d5273763) Thanks [@Seldszar](https://github.com/Seldszar)! - Changed the development source maps for producing better ones.

## 1.4.0

### Minor Changes

- [`17a5ca7`](https://github.com/Seldszar/fanion/commit/17a5ca7c1973b3116a16a6b882c26b5e95b39be9) Thanks [@Seldszar](https://github.com/Seldszar)! - Updated the TypeScript plugin to ignore if the configuration file hasn't been successfully resolved, and refactored the alias resolve plugin to use the resolved base URL instead.

## 1.3.1

### Patch Changes

- [`da6c467`](https://github.com/Seldszar/fanion/commit/da6c467b2a12c89e3ff2f01573550e25faf30d54) Thanks [@Seldszar](https://github.com/Seldszar)! - Removed custom `publicPath` from the default Webpack configuration in order to properly resolve relative paths.

## 1.3.0

### Minor Changes

- [`3fca891`](https://github.com/Seldszar/fanion/commit/3fca8910ad1b51fac68fb82009f59c1b5f408116) Thanks [@Seldszar](https://github.com/Seldszar)! - Added TypeScript & Babel configuration file customization.

* [`c816093`](https://github.com/Seldszar/fanion/commit/c8160932fcda2702645fdd06d9d637944259d372) Thanks [@Seldszar](https://github.com/Seldszar)! - Normalized the plugin options.

## 1.2.0

### Minor Changes

- [`f2ce27b`](https://github.com/Seldszar/fanion/commit/f2ce27bf8750657cf7225df7e1513e7255d52a1e) Thanks [@Seldszar](https://github.com/Seldszar)! - Updated the preset format to handle custom options

## 1.1.1

### Patch Changes

- [`f4a73f8`](https://github.com/Seldszar/fanion/commit/f4a73f8e937aab883868acf87923aaeee92b6ae8) Thanks [@Seldszar](https://github.com/Seldszar)! - Reverted the `base` option for now, causing issues between the Webpack context & the plugins. Also updated the TypeScript plugin for a better configuration parsing.

## 1.1.0

### Minor Changes

- [`2f88420`](https://github.com/Seldszar/fanion/commit/2f8842086b344dae906c6521462354d5b4073470) Thanks [@Seldszar](https://github.com/Seldszar)! - Refactored `@fanion/webpack` for an easier usage & tweaked the TypeScript compiler options.
