module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['.eslintrc.js', 'dist'],
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
