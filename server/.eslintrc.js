module.exports = {
  extends: 'airbnb/base',

  rules: {
    'no-console': 0,
    'func-names': 0,
    'no-param-reassign': 0,
    'prefer-destructuring': 0,
    'object-curly-newline': 0,

    'no-multi-spaces': [
      'error',
      { exceptions: { VariableDeclarator: true } },
    ],
  },
};
