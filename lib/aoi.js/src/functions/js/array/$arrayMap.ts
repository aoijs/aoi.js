import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
import { Transpiler, functions } from '../../../index.js';
import { type FunctionData, type funcData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
	getFunctionList,
} from '../../../util/transpilerHelpers.js';
export const $arrayMap: FunctionData = {
	name: '$arrayMap',
	brackets: true,
	optional: false,
	type: 'scope_getter',
	fields: [
		{
			name: 'name',
			type: 'string',
			required: true,
		},
		{
			name: 'query',
			type: 'function',
			required: true,
		},
	],
	description: 'maps the array based on the code',
	default: ['void', 'void'],
	returns: 'array',
	version: '7.0.0',
	example: `
        $arrayCreate[myArray;1;2;3;4;5]
        $arrayMap[myArray;$sum[$env[array_element];1]] // returns [2,3,4,5,6]
    `,
	code: (data: funcData, scope: Scope[]) => {
		const [name, ...values] = data.splits;
		const currentScope = scope[scope.length - 1];
		if (
			!currentScope.variables.includes(name) &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		)
			throw new TranspilerError(
				`${data.name}: Variable ${name} does not exists`,
			);

		const code = values.join(';');

		const codeFunctionList = getFunctionList(code, Object.keys(functions));

		let executedCode;
		if (codeFunctionList.length) {
			executedCode = Transpiler(code, {
				sendMessage: false,
				scopeData: {
					variables: currentScope.variables,
					name: currentScope.name,
					objects: currentScope.objects,
					env: [...currentScope.env, 'array_element'],
				},
				client: currentScope.client,
			});
			currentScope.functions += executedCode.scope[0].functions + '\n';
			currentScope.packages += executedCode.scope[0].packages;
			executedCode = executedCode.code;
		} else {
			executedCode = code;
		}

		const res = escapeResult(`
                ${escapeVars(name)}.map(array_element => {
                    ${executedCode}
                    })`);

		currentScope.update(res, data);

		return {
			code: res,
			scope,
			data,
		};
	},
};
