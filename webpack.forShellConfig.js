const webpackMerge = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const ImportMapPlugin = require('webpack-import-map-plugin');
const { getAppConfig } = require('./app-config');
const path = require('path');

const { projectName } = getAppConfig();

const externalPackages = ['@gpn-prototypes/vega-ui', '@apollo/client', 'grapqhl'];

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'vega',
    projectName,
    webpackConfigEnv,
  });

  const config = webpackMerge.smart(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    entry: ['./src/singleSpaEntry.tsx'],
    externals: [...externalPackages],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'postcss-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new ImportMapPlugin({
        fileName: 'import-map.json',
        baseUrl: process.env.BASE_URL,
        filter(x) {
          return ['main.js'].includes(x.name);
        },
        transformKeys(filename) {
          if (filename === 'main.js') {
            return `@vega/${projectName}`;
          }

          return undefined;
        },
      }),
    ],
  });

  return config;
};
