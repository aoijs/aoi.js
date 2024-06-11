import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
//import { StringObject, parseStringObject } from '../../../index.js';
import { type FuncData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
	//parseData,
} from '../../../util/transpilerHelpers.js';

const arrayAt = new AoiJSFunction()
	.setName('$arrayAt')
	.setType('getter')
	.setBrackets(true)
	.setOptional(false)
	.setFields( [
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
	],)
	.setVersion('7.0.0')
	.setDefault(["void", "void"])
	.setReturns('any')
	.setDescription('returns the value of the array at the specified index')
	.setExample(`$arrayCreate[myArray;hello;world;nya]
        $arrayAt[myArray;1] // returns "hello"
        $arrayAt[myArray;2] // returns "world"
        $arrayAt[myArray;-1] // returns "nya"`);

    arrayAt.setCode((data: FuncData, scope: Scope[], thisArg) => {
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

            const resultStirng = `${escapeVars(name)}?.at(${parsedIndex})`
		const res = escapeResult(resultStirng);
		currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, arrayAt);

export const $arrayAt = arrayAt.build();
