import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
import { type FunctionData, type funcData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
	parseData,
} from '../../../util/transpilerHelpers.js';
export const $addObjectProperty: FunctionData = {
	name: '$addObjectProperty',
	brackets: true,
	optional: false,
	type: 'function',
	fields: [
		{
			name: 'name',
			type: 'string',
			description: 'The name of the object to add the property to',
			required: true,
		},
		{
			name: 'key',
			type: 'string',
			description: 'The key of the property to add',
			required: true,
		},
		{
			name: 'value',
			type: 'any',
			description: 'The value of the property to add',
			required: true,
		},
	],
	version: '7.0.0',
	description: 'adds a value to the key in the object',
	default: ['void', 'void', 'void'],
	returns: 'void',
	example: `
        $createObject[object;{key:value}]
        $addObjectProperty[object;key2;value2]
        $getObjectProperty[object;key2] // returns value2
    `,
	code: (data: funcData, scope: Scope[]) => {
		const currentScope = scope[scope.length - 1];
		const [name, key, ...value] = data.splits;
		const parsedValue = parseData(value.join(';'));

		if (
			!value.length &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		) {
			throw new TranspilerError(`${data.name}: No Value Provided`);
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

		currentScope.objects[name].addKey(key);
		currentScope.objects[name].addValue(parsedValue);
		const res = escapeResult(`${escapeVars(name)}.${key} = ${parsedValue}`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},
};
