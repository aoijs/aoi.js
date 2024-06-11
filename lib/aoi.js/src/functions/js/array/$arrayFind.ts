import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
//import { StringObject, parseStringObject } from '../../../index.js';
import { type FuncData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
    getFunctionList,
    parseResult,
	//parseData,
} from '../../../util/transpilerHelpers.js';
import { conditionLexer, transpiler } from '@aoi.js/core/index.js';
import functions from '@aoi.js/functions/index.js';

const arrayFind = new AoiJSFunction()
	.setName('$arrayFind')
	.setType('scope_getter')
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
			name: 'query',
			type: 'function',
			description: 'The query to check',
			required: true,
		},
	],)
	.setVersion('7.0.0')
	.setDefault(["void", "void"])
	.setReturns('any')
	.setDescription('filters the array based on the condition')
	.setExample(` $arrayCreate[myArray;1;2;3;4;5]
        $arrayFilter[myArray;$env[array_element]<=;5] // returns [1,2,3,4,5]
        $arrayFilter[myArray;$env[array_element]>=;5] // returns [5]`);

        arrayFind.setCode((data: FuncData, scope: Scope[], thisArg) => {
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
    
            const condition = values.join(';');
            const conditionFunctionList = getFunctionList(
                condition,
                Object.keys(functions),
            );
            let executedCondition;
            if (conditionFunctionList.length) {
                executedCondition = transpiler(condition, {
                    sendMessage: false,
                    scopeData: {
                        variables: currentScope.variables,
                        name: currentScope.name,
                        objects: currentScope.objects,
                        env: [...currentScope.env, 'array_element'],
                    },
                    client: currentScope.client,
                });
                currentScope.functions +=
                    executedCondition.scope[0].functions + '\n';
                currentScope.packages += executedCondition.scope[0].packages;
                executedCondition = executedCondition.code;
            } else {
                executedCondition = condition;
            }
    
            executedCondition = conditionLexer(executedCondition);
    
            executedCondition = executedCondition.solve();

            const resultStirng = `${escapeVars(name)}.filter(array_element => ${ parseResult(executedCondition)})`
            const res = escapeResult(
                resultStirng
            );
    
            currentScope.update(res, data);

	return {
		code: res,
		scope,
        data
	};
}, arrayFind);

export const $arrayFind = arrayFind.build();


