import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
//import { StringObject, parseStringObject } from '../../../index.js';
import { type FuncData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
    //getFunctionList,
    //parseResult,
	//parseData,
} from '../../../util/transpilerHelpers.js';

const arrayIncludes = new AoiJSFunction()
	.setName('$arrayIncludes')
	.setType('scope')
	.setBrackets(true)
	.setOptional(false)
	.setFields( [
		{
			name: 'array',
			type: 'string',
			description: 'The value to check',
			required: true,
		},
		{
			name: 'value',
			type: 'string',
			description: 'The code to execute',
			required: true,
		},
	],)
	.setVersion('7.0.0')
	.setDefault(["void", "void"])
	.setReturns('boolean')
	.setDescription(`$arrayCreate[myArray;hello;world;nya]
        $arrayIncludes[myArray;hello] // returns true
        $arrayIncludes[myArray;hi] // returns false`);

        arrayIncludes.setCode((data: FuncData, scope: Scope[], thisArg) => {
            const currentScope = scope[scope.length - 1];
		const [name, value] = data.splits;

		if (
			!currentScope.variables.includes(name) &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		)
			throw new TranspilerError(
				`${data.name}: Array ${name} does not exist`,
			);

		const res = escapeResult(`${escapeVars(name)}.includes(${value})`);
		currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, arrayIncludes);

export const $arrayIncludes = arrayIncludes.build();


