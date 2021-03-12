module.exports = {
  extends: [require.resolve('@gpn-prototypes/frontend-configs/.eslintrc')],
  overrides: [
    {
      files: ['./src/**/index.stories.tsx'],
      rules: {
        'import/no-default-export': ['off'],
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'no-underscore-dangle': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src/']],
        extensions: ['.ts', '.tsx', '.json', 'js', 'jsx'],
      },
    },
  },
};
