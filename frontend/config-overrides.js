const webpack = require('webpack');

// see: https://github.com/timarney/react-app-rewired
module.exports = {
  // The Webpack config used when compiling the react app for development or production.
  webpack: (config, env) => {
    // add node.js polyfils, required by e.g. package @metamask/eth-sig-util
    // also see: https://github.com/ChainSafe/web3.js
    config.resolve.fallback = Object.assign({}, config.resolve.fallback || {}, {
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      // TODO
    })
    config.plugins = [].concat(config.plugins || [], [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ])
    config.ignoreWarnings = [/Failed to parse source map/]

    return config
  },
  // The Jest config for running tests
  // NOTE: webpack is NOT used when running tests, this is completely independent of the config above
  jest: (config) => {
    return config
  },
  // NOTE: also available: devServer, paths; see https://github.com/timarney/react-app-rewired
}
