import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { TranspilerError } from '../../../core/error.js';
import type Scope from '../../../core/structs/Scope.js';
//import { StringObject, parseStringObject } from '../../../index.js';
import { type FuncData } from '../../../typings/interfaces.js';
import {
	escapeResult,
	escapeVars,
    getFunctionList,
	//parseData,
} from '../../../util/transpilerHelpers.js';
import { transpiler } from '@aoi.js/core/transpiler.js';
import functions from '@aoi.js/functions/index.js';

const arrayMap = new AoiJSFunction()
	.setName('$arrayMap')
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
	.setReturns('array')
	.setDescription('maps the array based on the code')
	.setExample(`$arrayCreate[myArray;1;2;3;4;5]
        $arrayMap[myArray;$sum[$env[array_element];1]] // returns [2,3,4,5,6]`);

        arrayMap.setCode((data: FuncData, scope: Scope[], thisArg) => {
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
                executedCode = transpiler(code, {
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

            const resultStirng = `${escapeVars(name)}.map(array_element => { ${executedCode} })`
            const res = escapeResult(resultStirng);
    
            currentScope.update(res, data);
	return {
		code: res,
		scope,
        data
	};
}, arrayMap);

export const $arrayMap = arrayMap.build();
