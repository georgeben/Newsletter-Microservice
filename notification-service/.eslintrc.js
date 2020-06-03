module.exports = {
  env: {
    commonjs: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'object-curly-newline': 'off',
    'no-unused-vars': 'warn',
    'class-methods-use-this': 'off',
    'func-names': 'off',
  },
};
