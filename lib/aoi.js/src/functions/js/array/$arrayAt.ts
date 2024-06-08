import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
import { type FunctionData, type funcData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
} from '../../../util/transpilerHelpers.js';
export const $arrayAt: FunctionData = {
	name: '$arrayAt',
	brackets: true,
	optional: false,
	type: 'getter',
	fields: [
		{
			name: 'name',
			type: 'string',
			description: 'The name of the array',
			required: true,
		},
		{
			name: 'index',
			type: 'number',
			description: 'The index of the array',
			required: true,
		},
	],
	description: 'returns the value of the array at the specified index',
	default: ['void', 'void'],
	returns: 'any',
	version: '7.0.0',
	example: `
        $arrayCreate[myArray;hello;world;nya]
        $arrayAt[myArray;1] // returns "hello"
        $arrayAt[myArray;2] // returns "world"
        $arrayAt[myArray;-1] // returns "nya"
    `,
	code: (data: funcData, scope: Scope[]) => {
		const [name, index] = data.splits;
		const currentScope = scope[scope.length - 1];
		if (
			!currentScope.variables.includes(name) &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		)
			throw new TranspilerError(
				`${data.name}: Variable ${name} doesn't exist`,
			);

		const parsedIndex = (Number(index) < 0 ? Number(index) : Number(index) - 1);
		if (
			isNaN(parsedIndex) &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		)
			throw new TranspilerError(`${data.name}: Index must be a number`);

		const res = escapeResult(`${escapeVars(name)}?.at(${parsedIndex})`);
		currentScope.update(res, data);

		return {
			code: res,
			scope,
		};
	},
};
