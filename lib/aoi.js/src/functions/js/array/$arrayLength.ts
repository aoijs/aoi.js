import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
import { type FunctionData, type funcData } from '../../../typings/interfaces.js';
import { escapeResult, escapeVars } from '../../../util/transpilerHelpers.js';
export const $arrayLength: FunctionData = {
	name: '$arrayLength',
	brackets: true,
	optional: false,
	type: 'getter',
	fields: [
		{
			name: 'array',
			type: 'string',
			description: 'The name of the array',
			required: true,
		},
	],
	description: 'Returns the length of an array.',
	default: ['void'],
	returns: 'number',
	version: '7.0.0',
	example: `
        $arrayCreate[myArray;hello;world;nya]
        $arrayLength[myArray] // returns 3
    `,
	code: (data: funcData, scope: Scope[]) => {
		const currentScope = scope[scope.length - 1];
		const name = data.inside!;

		if (
			!currentScope.variables.includes(name) &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		)
			throw new TranspilerError(
				`${data.name}: Array ${name} does not exist`,
			);

		const res = escapeResult(`${escapeVars(name)}.length`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},
};
