import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
import { type FunctionData, type funcData } from '../../../typings/interfaces.js';
import { escapeResult, escapeVars } from '../../../util/transpilerHelpers.js';
export const $cloneObject: FunctionData = {
	name: '$cloneObject',
	brackets: true,
	optional: false,
	type: 'setter',
	version: '7.0.0',
	fields: [
		{
			name: 'name',
			type: 'string',
			description: 'The name of the object to clone',
			required: true,
		},
		{
			name: 'target',
			type: 'string',
			description: 'The name of the object to clone to',
			required: true,
		},
	],
	description: 'clones an Object',
	default: ['void', 'void'],
	returns: 'void',
	example: `
        $createObject[object;{key:value}]
        $cloneObject[object;object2]
        $getObjectProperty[object2;key] // returns value
    `,
	code: (data: funcData, scope: Scope[]) => {
		const currentScope = scope[scope.length - 1];
		const [name, target] = data.splits;
		if (
			!currentScope.objects[name] &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		) {
			throw new TranspilerError(
				`${data.name}: Invalid Object Name Provided`,
			);
		}

		currentScope.objects[target] = currentScope.objects[name];
		const res = escapeResult(
			`const ${escapeVars(target)} =  structuredClone(${escapeVars(name)});`,
		);
		currentScope.update(res, data);

		return {
			code: '',
			scope,
		};
	},
};
