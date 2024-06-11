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

const arrayLength = new AoiJSFunction()
	.setName('$arrayLength')
	.setType('scope_getter')
	.setBrackets(true)
	.setOptional(false)
	.setFields( [
		{
			name: 'array',
			type: 'string',
			description: 'The name of the array',
			required: true,
		},
	],)
	.setVersion('7.0.0')
	.setDefault(["void", "void"])
	.setReturns('number')
	.setDescription('Returns the length of an array')
	.setExample(`$arrayCreate[myArray;hello;world;nya]
        $arrayLength[myArray] // returns 3`);

        arrayLength.setCode((data: FuncData, scope: Scope[], thisArg) => {
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

            const resultStirng = `${escapeVars(name)}.length`
		const res = escapeResult(resultStirng);
		currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, arrayLength);

export const $arrayLength = arrayLength.build();


