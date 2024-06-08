import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
import { StringObject, parseStringObject } from '../../../index.js';
import { type FuncData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
	parseData,
} from '../../../util/transpilerHelpers.js';

const arrayCreate = new AoiJSFunction()
	.setName('$arrayCreate')
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
			type: 'unknown',
			description: 'The values to create the array with',
			required: true,
		},
	],)
	.setVersion('7.0.0')
	.setDefault(["void", "void"])
	.setReturns('void')
	.setDescription('creates an array with the specified values')
	.setExample(`$arrayCreate[myArray;hello;world;nya]
        $arrayCreate[myNextArray;1;2;3]`);

 arrayCreate.setCode((data: FuncData, scope: Scope[], thisArg) => {
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
		const parsedValues = values.map((v) => parseData(v));
		const currentObj = new StringObject('[');
		currentObj.addEnd(']');

		const array = parseStringObject(
			`[${parsedValues.join(' , ')}]`,
			currentObj,
		);

		currentScope.objects[name] = array;
		currentScope.variables.push(name);

        const resultStirng = `const ${escapeVars(name)} = ${array.solve()};`
		const res = escapeResult(
            resultStirng
		);
		currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, arrayCreate);

export const $arrayCreate = arrayCreate.build();
