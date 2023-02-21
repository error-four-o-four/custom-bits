const rulesJs = {
  // 'import/no-unresolved': 'error',
  'import/extensions': [
    'warn',
    'always',
    {
      ignorePackages: true,
      pattern: {
        ts: 'never',
      },
    },
  ],
  'import/prefer-default-export': 0,
  'import/no-extraneous-dependencies': 0,

  'no-console': 0,
  'no-nested-ternary': 0,
  'no-restricted-syntax': 0,
  'no-unused-vars': 1,
  'no-param-reassign': 0,
  // "no-unused-vars": [
  //   "warn",
  //   { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }
  // ],

  'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
};

const rulesTs = {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/restrict-template-expressions': 'off',
  // "@typescript-eslint/dot-notation": "off",
  // "@typescript-eslint/explicit-function-return-type": "off",
  // '@typescript-eslint/no-unused-vars': [
  //   'warn',
  //   {
  //     argsIgnorePattern: '^_',
  //     varsIgnorePattern: '^_',
  //     caughtErrorsIgnorePattern: '^_',
  //   },
  // ],
};

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'import', 'prettier'],
  rules: rulesJs,
  // ts config
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // "tsconfigRootDir": "__dirname",
        project: ['tsconfig.package.json'],
      },
      plugins: ['@typescript-eslint', 'react', 'import', 'prettier'],
      extends: [
        'eslint:recommended',
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      // ignorePatterns: ['*.css'],

      rules: {
        ...rulesJs,
        ...rulesTs,
      },
    },
  ],
};
