const base = require('@gpn-prototypes/frontend-configs/babel.config');

module.exports = {
  ...base,
  plugins: [...base.plugins, '@babel/plugin-proposal-class-properties'],
};
