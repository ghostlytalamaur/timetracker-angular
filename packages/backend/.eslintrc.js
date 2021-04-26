module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig*?.json',
      },
    },
  ],
  env: {
    node: true,
    jest: true,
  },
};
