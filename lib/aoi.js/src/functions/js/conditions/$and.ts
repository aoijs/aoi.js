import { conditionLexer } from '../../../index.js';
import { type FunctionData } from '../../../typings/interfaces.js';
import { escapeFunctionResult, parseResult } from '../../../util/transpilerHelpers.js';
export const $and: FunctionData = {
	name: '$and',
	type: 'getter',
	brackets: true,
	optional: false,
	version: '7.0.0',
	fields: [
		{
			name: 'condition',
			type: 'string',
			description: 'The condition to check',
			required: true,
		},
	],
	default: ['void'],
	returns: 'boolean',
	description: 'Returns true if all conditions are true ( function version of && )',
	example: `
    $and[$isNumber[1];$isNumber[2]] // returns true 
    $and[$isNumber[1];$isNumber[hello]] // returns false
    `,
	code: (data, scope) => {
		const conditions = data.splits;
		const currentScope = scope[scope.length - 1];

		const solved = conditionLexer( conditions.join( '&&' ) ).solve( );
		const res = escapeFunctionResult( parseResult(solved) );
		currentScope.update( res, data );
		return {
			code: res,
			scope,
			data,
		};
	},
};
