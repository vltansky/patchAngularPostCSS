# Patch Angular PostCSS

This library exports function that can be used inside custom-webpack to add custom postcss plugins

## API

| name                  | default |             description |
| --------------------- | :-----: | ----------------------: |
| webpackConfig         |         |          Webpack config |
| addPlugins            |   []    |        Array of plugins |
| patchComponentsStyles | `false` | patch components styles |
| patchGlobalStyles     | `true`  | patch components styles |

## Example

`webpack.config.js`:

```
const { patchPostCSS } = require("patchAngularPostCSS");


module.exports = (config) => {
function patchPostCSS({
  webpackConfig: config,
  addPlugins: [require('postcss-preset-env'), require('postcss-css-variables')],
  patchComponentsStyles: true,
  patchGlobalStyles: true,
}
};
```

## Contributing

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.
