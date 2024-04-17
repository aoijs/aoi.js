import globals from 'globals';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
const compat = new FlatCompat({ baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended });

export default [
	jsdoc.configs['flat/recommended'],
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
	{ languageOptions: { globals: globals.node } },
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
	...compat.extends('xo-typescript'),
	...tseslint.configs.recommended,
	{
		// enable object curly spacing
		rules: { '@typescript-eslint/object-curly-spacing': ['error', 'always'] },
	},
	{
		files: ['**/*.js', '**/*.ts', '**/*.mjs'],
		plugins: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			jsdoc,
		},
		rules: {
			'jsdoc/require-description': 'warn',
		},
	},
];
