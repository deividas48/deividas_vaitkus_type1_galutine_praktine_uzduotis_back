module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
    'import/extensions': 'off',
    'consistent-return': 'off',
    camelcase: 'off',
    quotes: 'off',
    'linebreak-style': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__dirname', '__filename'],
      },
    ],
  },
};
