const config = require('@nejcm/configs/src/.eslintrc.js');

module.exports = Object.assign(config, {
  rules: Object.assign(config.rules, {
    'babel/no-unused-expressions': 'off',
    'babel/new-cap': 'off',
    'no-useless-constructor': 'off',
    'import/order': 'off',
    'no-shadow': 'off',
    'dot-notation': 'off',
    'no-use-before-define': 'off',
    'react-hooks/exhaustive-deps': 'error',
  }),
  plugins: config.plugins.concat(['eslint-plugin-react-hooks']),
  globals: {
    SocketIOClient: true,
  },
});
