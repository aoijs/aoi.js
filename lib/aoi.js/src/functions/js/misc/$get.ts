import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
import { type FunctionData, type funcData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
	removeSetFunc,
} from '../../../util/transpilerHelpers.js';

export const $get: FunctionData = {
	name: '$get',
	brackets: true,
	optional: false,
	type: 'getter',
	fields: [
		{
			name: 'name',
			type: 'string',
			description: 'The name of the variable to get',
			required: true,
		},
	],
	version: '7.0.0',
	default: ['void'],
	returns: 'any',
	description: 'Gets the value of the variable',
	example: `
        $let[hello;world]
        $get[hello] // returns world
    `,
	code: (data: funcData, scope: Scope[]) => {
		const splits = data.splits;
		const currentScope = scope[scope.length - 1];
		if ($get.brackets) {
			if (
				!data.total.startsWith($get.name + '[') &&
                (!currentScope.name.startsWith('$try_') ||
                    !currentScope.name.startsWith('$catch_'))
			) {
				throw new TranspilerError(
					`${data.name} requires closure brackets`,
				);
			}
		}

		if (
			splits.length !== 1 &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		) {
			throw new TranspilerError(`${data.name} requires 1 argument`);
		}

		const name = removeSetFunc(splits[0]);
		if (
			name === '' &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		) {
			throw new TranspilerError(`${data.name} requires a name`);
		}

		if (
			!currentScope.variables.includes(name) &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		) {
			throw new TranspilerError(`${data.name} cannot find ${name}`);
		}

		const res = `${escapeResult(escapeVars(name))}`;

		currentScope.update( res, data );
		return { code: res, scope: scope };
	},
};
