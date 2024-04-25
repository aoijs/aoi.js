import globals from 'globals';
import tseslint from 'typescript-eslint';
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
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
	
	...compat.extends('xo-typescript'),
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	...tseslint.configs.stylisticTypeChecked,
	{
		// enable object curly spacing
		rules: {
			'@typescript-eslint/object-curly-spacing': ['error', 'always'],
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
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'tsdoc/syntax': 'warn',
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
