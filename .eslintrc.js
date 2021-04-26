module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
      plugins: ['@typescript-eslint'],
    },
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              object: false,
              Function: false,
            },
            extendDefaults: true,
          },
        ],
        'no-invalid-this': 'off',
        '@typescript-eslint/no-invalid-this': ['off'],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'no-public',
            overrides: {
              accessors: 'no-public',
              constructors: 'no-public',
            },
          },
        ],
        '@typescript-eslint/indent': [
          'off',
          2,
          {
            ArrayExpression: 'first',
            ObjectExpression: 'first',
            FunctionDeclaration: {
              parameters: 'first',
            },
            FunctionExpression: {
              parameters: 'first',
            },
          },
        ],
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'semi',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
          },
        ],
        '@typescript-eslint/member-ordering': 'error',
        'no-case-declarations': 'off',
        '@typescript-eslint/no-empty-function': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': [
          'error',
          {
            ignoreRestArgs: true,
          },
        ],
        '@typescript-eslint/no-inferrable-types': [
          'error',
          {
            ignoreParameters: true,
          },
        ],
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': [
          'error',
          {
            hoist: 'all',
          },
        ],
        '@typescript-eslint/no-this-alias': 'error',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        '@typescript-eslint/no-unused-expressions': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'none',
          },
        ],
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/no-useless-constructor': ['error'],
        '@typescript-eslint/quotes': [
          'error',
          'single',
          {
            allowTemplateLiterals: true,
          },
        ],
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/strict-boolean-expressions': [
          'off',
          {
            allowNullable: true,
          },
        ],
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-body-style': 'off',
        'arrow-parens': 'off',
        'brace-style': ['error', '1tbs'],
        'comma-dangle': ['off'],
        '@typescript-eslint/comma-dangle': [
          'error',
          {
            arrays: 'always-multiline',
            exports: 'always-multiline',
            functions: 'always-multiline',
            imports: 'always-multiline',
            objects: 'always-multiline',
            enums: 'always-multiline',
            tuples: 'always-multiline',
            generics: 'ignore',
          },
        ],
        'constructor-super': 'error',
        curly: 'error',
        'default-case': 'error',
        eqeqeq: ['error', 'smart'],
        'guard-for-in': 'error',
        'id-blacklist': 'off',
        'id-match': 'off',
        'linebreak-style': ['off', 'unix'],
        'no-bitwise': 'off',
        'no-caller': 'error',
        'no-console': [
          'error',
          {
            allow: [
              'log',
              'warn',
              'dir',
              'timeLog',
              'assert',
              'clear',
              'count',
              'countReset',
              'group',
              'groupEnd',
              'table',
              'dirxml',
              'error',
              'groupCollapsed',
              'Console',
              'profile',
              'profileEnd',
              'timeStamp',
              'context',
            ],
          },
        ],
        'no-debugger': 'error',
        'no-duplicate-imports': 'error',
        'no-empty': 'off',
        'no-eval': 'error',
        'no-fallthrough': 'error',
        'no-irregular-whitespace': 'error',
        'no-multiple-empty-lines': [
          'error',
          {
            max: 1,
          },
        ],
        'no-new-wrappers': 'error',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': [
          'error',
          {
            ignoreDeclarationMerge: true,
          },
        ],
        'no-restricted-imports': ['error', 'rxjs/Rx'],
        'no-template-curly-in-string': 'error',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'off',
        'no-useless-constructor': 'off',
        'no-var': 'error',
        'no-void': 'error',
        'object-shorthand': 'error',
        'padding-line-between-statements': [
          'error',
          {
            blankLine: 'always',
            prev: '*',
            next: 'return',
          },
        ],
        'prefer-arrow/prefer-arrow-functions': 'off',
        'prefer-const': 'error',
        'prefer-object-spread': 'error',
        'prefer-template': 'error',
        radix: 'error',
        'space-before-function-paren': 'off',
        '@typescript-eslint/space-before-function-paren': [
          'error',
          {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always',
          },
        ],
        'space-in-parens': ['off', 'always'],
        'spaced-comment': [
          'off',
          'always',
          {
            exceptions: ['*'],
            markers: ['/'],
          },
        ],
      },
      plugins: ['@typescript-eslint'],
    },
  ],
};
