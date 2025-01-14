/* eslint-disable @typescript-eslint/naming-convention */
import globals from 'globals';
// import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import tsdoc from 'eslint-plugin-tsdoc';

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: pluginJs.configs.recommended,
});

export default [
	// jsdoc.configs['flat/recommended'],
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' }, ignorePatterns: ['**/node_modules/**', '**/dist/**'] },

	...compat.extends('xo-typescript'),
	 
	// ...tseslint.configs.stylisticTypeChecked,
	{
		// enable object curly spacing
		rules: {
			'@typescript-eslint/object-curly-spacing': ['error', 'always'],
			'@typescript-eslint/consistent-type-definitions': [
				'error',
				'interface',
			],
			'@typescript-eslint/parameter-properties': 'off',
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['camelCase', 'UPPER_CASE'],
					leadingUnderscore: 'allow',
				},
				{
					selector: 'classProperty',
					format: ['camelCase'],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'allow',
				},
				{ selector: 'parameter', format: ['camelCase'] },
				{ selector: 'typeLike', format: ['PascalCase'] },
				// all interfaces should be prefixed with I
				{
					selector: 'interface',
					format: ['PascalCase'],
					custom: {
						regex: '^I[A-Z]+',
						match: true,
					},
				},
			],
			'@typescript-eslint/prefer-literal-enum-member': [
				'error',
				{
					allowBitwiseExpressions: true,
				},
			],
			'@typescript-eslint/prefer-ts-expect-error': 'off',
		},
	},
	{
		files: ['**/*.js', '**/*.mjs'],
		plugins: {
			jsdoc,
		},
		rules: {
			'jsdoc/require-description': 'warn',
		},
	},
	{
		files: ['**/*.ts'],
		plugins: {
			tsdoc,
		},
		rules: {
			'tsdoc/syntax': 'error',
		},
	},
	{
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				project: [
					'./tsconfig.eslint.json',
					'./lib/*/tsconfig.eslint.json',
				],
				tsconfigRootDir: __dirname,
			},
		},
	},
];
