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

const arrayConcat = new AoiJSFunction()
	.setName('$arrayConcat')
	.setType('setter')
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
			name: 'values',
			type: 'string[]',
			description: 'The arrays to concatenate',
			required: true,
		},
	],)
	.setVersion('7.0.0')
	.setDefault(["void", "void"])
	.setReturns('void')
	.setDescription('concatenates the specified values to the array')
	.setExample(`$arrayCreate[myArray;hello;world]
        $arrayCreate[myNextArray;nya]

        $arrayConcat[myArray;myNextArray] // myArray is now ["hello", "world", "nya"]`);

   arrayConcat.setCode((data: FuncData, scope: Scope[], thisArg) => {
    const [name, ...values] = data.splits;
		const currentScope = scope[scope.length - 1];
		if (
			currentScope.objects[name] &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		)
			throw new TranspilerError(
				`${data.name}: Variable ${name} already exists`,
			);
		if (
			!currentScope.variables.every((x) => values.includes(x)) &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		)
			throw new TranspilerError(
				`${data.name}: array ${values
					.filter((x) => !currentScope.variables.includes(x))
					.join(', ')} do(es) not exist`,
			);

		currentScope.variables.push(name);
		const parsedValues = values.map((v) => escapeVars(v));

        const resultStirng = `const ${escapeVars(name)} = ${parsedValues[0]}.concat(${parsedValues.slice(1).join(',')}) ;`
		const res = escapeResult(
            resultStirng
		);
		currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, arrayConcat);

export const $arrayConcat = arrayConcat.build();
