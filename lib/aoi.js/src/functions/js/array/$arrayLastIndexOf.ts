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
} from '../../../util/transpilerHelpers.js';;

const arrayLastIndexOf = new AoiJSFunction()
	.setName('$arrayLastIndexOf')
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
			name: 'value',
			type: 'string',
			description: 'The value to check',
			required: true,
		},
	],)
	.setVersion('7.0.0')
	.setDefault(["void", "void"])
	.setReturns('number')
	.setDescription('filters the array based on the condition')
	.setExample(`$arrayCreate[myArray;hello;world;nya;hello]
        $arrayLastIndexOf[myArray;hello] // returns 4

        $arrayLastIndexOf[myArray;hi] // returns 0`);

        arrayLastIndexOf.setCode((data: FuncData, scope: Scope[], thisArg) => {
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

                const resultStirng = `${escapeVars(name)}.lastIndexOf(${value}) + 1`
            const res = escapeResult(
                resultStirng
            );
            currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, arrayLastIndexOf);

export const $arrayLastIndexOf = arrayLastIndexOf.build();


