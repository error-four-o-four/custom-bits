/* eslint-env node */

module.exports = {
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	globals: {
		__dirname: true,
	},
	extends: [
		'eslint:recommended',
		'airbnb-base',
		'airbnb-typescript/base',
		'plugin:n/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:promise/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./demo/tsconfig.json', './packages/*/tsconfig.json'],
		// tsconfigRootDir: __dirname,
	},
	plugins: ['@typescript-eslint', 'import', 'promise', 'prettier'],
	overrides: [
		{
			files: ['./**/*.js', './**/*.cjs'],
			extends: ['plugin:@typescript-eslint/disable-type-checked'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	root: true,
	rules: {
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
		'n/no-missing-import': [
			'error',
			{
				allowModules: ['@custom-bits/core'],
			},
		],
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: ['./demo/tsconfig.json', './packages/*/tsconfig.json'],
			},
		},
	},
};

// const rulesJs = {
//   // 'import/no-unresolved': 'error',
//   'import/extensions': [
//     'warn',
//     'always',
//     {
//       ignorePackages: true,
//       pattern: {
//         ts: 'never',
//       },
//     },
//   ],
//   'import/prefer-default-export': 0,
//   'import/no-extraneous-dependencies': 0,

//   'no-console': 0,
//   'no-nested-ternary': 0,
//   'no-restricted-syntax': 0,
//   'no-unused-vars': 1,
//   'no-param-reassign': 0,
//   // "no-unused-vars": [
//   //   "warn",
//   //   { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }
//   // ],

//   'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
// };

// const rulesTs = {
//   '@typescript-eslint/no-explicit-any': 'off',
//   '@typescript-eslint/no-non-null-assertion': 'off',
//   '@typescript-eslint/restrict-template-expressions': 'off',
//   // "@typescript-eslint/dot-notation": "off",
//   // "@typescript-eslint/explicit-function-return-type": "off",
//   // '@typescript-eslint/no-unused-vars': [
//   //   'warn',
//   //   {
//   //     argsIgnorePattern: '^_',
//   //     varsIgnorePattern: '^_',
//   //     caughtErrorsIgnorePattern: '^_',
//   //   },
//   // ],
// };

// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//     node: true,
//   },
//   extends: [
//     'eslint:recommended',
//     'airbnb-base',
//     'plugin:import/recommended',
//     'plugin:prettier/recommended',
//     'prettier',
//   ],
//   parserOptions: {
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//   },
//   plugins: ['import', 'prettier'],
//   rules: rulesJs,
//   // ts config
//   overrides: [
//     {
//       files: ['**/*.{ts,tsx}'],
//       parser: '@typescript-eslint/parser',
//       parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//         // "tsconfigRootDir": "__dirname",
//         project: [
//           'tsconfig.json',
//           'tsconfig.eslint.json',
//           'examples/tsconfig.json',
//           'packages/**/tsconfig.json',
//         ],
//       },
//       plugins: ['@typescript-eslint', 'import', 'prettier'],
//       extends: [
//         'eslint:recommended',
//         'airbnb-base',
//         'airbnb-typescript/base',
//         'plugin:@typescript-eslint/eslint-recommended',
//         'plugin:@typescript-eslint/recommended',
//         'prettier',
//       ],
//       // ignorePatterns: ['*.css'],

//       rules: {
//         ...rulesJs,
//         ...rulesTs,
//       },
//     },
//   ],
// };
