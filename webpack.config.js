const merge = require('webpack-merge');
const dotenv = require('dotenv');
const webpack = require('webpack');

const appConfig = require('./app-config')();
const postCssConfig = require('./postcss.config');

dotenv.config();

const gpnWebpack = require('@gpn-prototypes/frontend-configs/webpack.config')({
  appConfig,
  postCssConfig,
});

const commonWebpack = () => {
  const envConfig = dotenv.config();

  const env = envConfig.error ? {} : envConfig.parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    // eslint-disable-next-line no-param-reassign
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    plugins: [new webpack.DefinePlugin(envKeys)],
  };
};

const appWebpack = {
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/graphql': process.env.VEGA_API_PROXY,
    },
  },
};

module.exports = merge(commonWebpack(), gpnWebpack, appWebpack);
