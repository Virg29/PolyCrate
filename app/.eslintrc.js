module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'simple-import-sort',
		'unused-imports',
		'prettier',
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	rules: {
		'array-callback-return': [
			'error',
			{
				checkForEach: true,
			},
		],
		'no-empty-function': [
			'error',
			{
				allow: ['constructors'],
			},
		],
		'no-unused-vars': 'warn',
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports',
			},
		],
		'no-console': 'warn',
		'@typescript-eslint/no-unused-vars': 'off',
		'prefer-const': 'warn',
		'unused-imports/no-unused-imports': 'warn',
		'simple-import-sort/imports': 'warn',
		'simple-import-sort/exports': 'warn',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
		],
	},
	overrides: [
		{
			excludedFiles: '.eslintrc.js',
		},
	],
};
