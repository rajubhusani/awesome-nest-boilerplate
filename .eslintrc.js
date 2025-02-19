export default {
    root: true,
    env: {
      node: true,
      jest: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint/eslint-plugin',
      'simple-import-sort',
      'import-helpers',
      'sonarjs',
      'unicorn',
      'no-secrets',
      'promise',
      'n',
    ],
    extends: [
    //   'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:sonarjs/recommended',
      'plugin:unicorn/recommended',
      'plugin:promise/recommended',
      'plugin:n/recommended',
      'prettier',
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    ignorePatterns: ['.eslintrc.js', 'dist'],
  }