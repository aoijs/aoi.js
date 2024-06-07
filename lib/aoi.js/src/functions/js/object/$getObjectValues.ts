import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
import { type FunctionData, type funcData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
} from '../../../util/transpilerHelpers.js';
export const $getObjectValues: FunctionData = {
	name: '$getObjectValues',
	brackets: true,
	optional: false,
	type: 'getter',
	fields: [
		{
			name: 'name',
			type: 'string',
			description: 'The name of the object to get the values from',
			required: true,
		},
	],
	version: '7.0.0',
	description: 'returns all the values in the object',
	default: ['void'],
	returns: 'void',
	example: `
        $createObject[object;{key:value,key2:value2}]
        $getObjectValues[object] // returns value, value2
    `,
	code: (data: funcData, scope: Scope[]) => {
		const currentScope = scope[scope.length - 1];
		const name = data.inside!;

		if (
			!name &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		) {
			throw new TranspilerError(`${data.name}: No name Provided`);
		}

		if (
			!currentScope.objects[name] &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		) {
			throw new TranspilerError(
				`${data.name}: Invalid Object Name Provided`,
			);
		}

		const res = escapeResult(`Object.values(${escapeVars(name)}).join(", ")`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},
};
