module.exports = {
  extends: 'airbnb/base',
  plugins: ['jest'],

  env: {
    'jest/globals': true,
  },
  rules: {
    'no-console': 0,
    'func-names': 0,
    'no-param-reassign': 0,
    'prefer-destructuring': 0,
    'object-curly-newline': 0,
    'import/newline-after-import': 0,
    'import/order': 0,
    'no-unused-vars': [
      'error', { argsIgnorePattern: '^_' },
    ],
    'arrow-body-style': 0,
    'implicit-arrow-linebreak': 0,

    'no-multi-spaces': [
      'error',
      { exceptions: { VariableDeclarator: true } },
    ],
  },
};
