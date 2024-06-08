import type Scope  from '../../../core/structs/Scope.js';
import { type funcData, type FunctionData } from '../../../typings/interfaces.js';
import { escapeResult } from '../../../util/transpilerHelpers.js';

export const $comment: FunctionData = {
	name: '$comment',
	type: 'scope',
	brackets: true,
	optional: false,
	version: '7.0.0',
	fields: [
		{
			name: 'comment',
			type: 'string',
			description: 'The comment to convert',
			required: true,
		},
	],
	default: ['void'],
	returns: 'void',
	description: 'Converts provided code to a comment',
	example: `
        $comment[hello world] // returns /*hello world*/
    `,
	code: (data: funcData, scope: Scope[]) => {
		const comment = data.inside;
		const currentScope = scope[scope.length - 1];
		const res = escapeResult('');
		currentScope.update( res, data );
		return {
			code: res,
			scope: scope,
			data: data,
		};
	},
};
