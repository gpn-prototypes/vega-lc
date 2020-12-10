const path = require('path');

const root = process.env.PROJECT_ROOT_DIR || path.join(__dirname, '..');

const getAppConfig = () => ({
  projectName: 'lc',
  entry: path.join(root, 'src/index.tsx'),
  root,
  buildDirPath: path.resolve(root, 'dist'),
  mode: process.env.NODE_ENV || 'development',
  env: process.env.VEGA_ENV || 'development',
  assetsPath: process.env.ASSETS_PATH || '/assets',
  port: process.env.PORT || 3000,
  apiURL: process.env.API_URL || '',
  analyze: process.env.ANALYZE || 0,
  baseApiUrl:
    process.env.BASE_API_URL ||
    process.env.VEGA_API_PROXY
});

module.exports = { getAppConfig };
