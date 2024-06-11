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

const arrayPop = new AoiJSFunction()
	.setName('$arrayPop')
	.setType('getter')
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
	.setReturns('any')
	.setDescription('Removes the last element from an array and returns that element. This method changes the length of the array')
	.setExample(`$arrayCreate[myArray;hello;world;nya]
        $arrayPop[myArray] // returns nya`);

        arrayPop.setCode((data: FuncData, scope: Scope[], thisArg) => {
            const currentScope = scope.at(-1)!;
		const name = data.inside!;

		if (
			!currentScope.variables.includes(name) &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		)
			throw new TranspilerError(
				`${data.name}: Array ${name} does not exist`,
			);

        const resultStirng = `${escapeVars(name)}.pop()`
		const res = escapeResult(resultStirng);
	return {
		code: res,
		scope,
	};
}, arrayPop);

export const $arrayPop = arrayPop.build();


