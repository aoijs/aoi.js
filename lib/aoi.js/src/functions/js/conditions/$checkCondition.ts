import { conditionLexer } from '../../../index.js';
import { type FunctionData } from '../../../typings/interfaces.js';
import {
	escapeResult, parseResult,
} from '../../../util/transpilerHelpers.js';
export const $checkCondition: FunctionData = {
	name: '$checkCondition',
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
	description: 'Returns true if the condition is true',
	example: `
    $checkCondition[$isNumber[1]] // returns true

    $checkCondition[hello === world] // returns false
    `,
	code: (data, scope) => {
		const conditions = data.inside!;
		const currentScope = scope[scope.length - 1];
		const solved = conditionLexer(conditions).solve();
		const res = escapeResult(parseResult(solved));
		currentScope.update( res, data );

		return {
			code: res,
			scope,
		};
	},
};
