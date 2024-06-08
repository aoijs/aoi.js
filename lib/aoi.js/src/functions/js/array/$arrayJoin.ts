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

const arrayJoin = new AoiJSFunction()
	.setName('$arrayJoin')
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
		{
			name: 'seperator',
			type: 'string',
			description: 'The separator to join the array with',
			required: false,
		},
	],)
	.setVersion('7.0.0')
	.setDefault(["void", ","])
	.setReturns('string')
	.setDescription('Joins all elements of an array into a string.')
	.setExample(` $arrayCreate[myArray;hello;world;nya]
        $arrayJoin[myArray] // returns hello, world, nya
    
        $arrayJoin[myArray; | ] // returns hello | world | nya`);

        arrayJoin.setCode((data: FuncData, scope: Scope[], thisArg) => {
            const currentScope = scope[scope.length - 1];
		const [name, separator = ', '] = data.splits;

		if (
			!currentScope.variables.includes(name) &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		)
			throw new TranspilerError(
				`${data.name}: Array ${name} does not exist`,
			);

            const resultStirng = `${escapeVars(name)}.join(${separator})`
		const res = escapeResult(resultStirng);
		currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, arrayJoin);

export const $arrayJoin = arrayJoin.build();


