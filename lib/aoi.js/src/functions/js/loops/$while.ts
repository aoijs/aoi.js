import { type FunctionData, TranspilerError, Transpiler, conditionLexer } from '../../../index.js';
import type Scope from '../../../core/structs/Scope.js';
import { type AsyncFunction } from '../../../typings/types.js';
import { getFunctionList, escapeResult } from '../../../util/transpilerHelpers.js';
import funcs from '../../index.js';
export const $while: FunctionData = {
	name: '$while',
	type: 'scope',
	brackets: true,
	optional: false,
	fields: [
		{
			name: 'condition',
			type: 'string',
			description: 'The condition to check',
			required: true,
		},
		{
			name: 'code',
			type: 'string',
			description: 'The code to execute if the while statement is true',
			required: true,
		},
	],
	version: '1.0.0',
	default: ['void', 'void'],
	returns: 'void',
	description: 'While statement',
	example: `
        $let[num;1]
        $while[$get[num] < 5;
            $log[hello world]
            $inc[$get[num]]
        ]
    `,
	code: (data, scope) => {
		const splits = data.splits;
		const currentScope = scope[scope.length - 1];
		if (
			data.inside?.trim() === '' ||
            (!data.inside &&
                (!currentScope.name.startsWith('$try_') ||
                    !currentScope.name.startsWith('$catch_')))
		) {
			throw new TranspilerError(
				`${data.name} function requires condition and code`,
			);
		}

		if (
			data.splits.length < 2 &&
            !currentScope.name.startsWith('$try_') &&
            !currentScope.name.startsWith('$catch_')
		) {
			throw new TranspilerError(
				`${data.name} function requires condition and code`,
			);
		}

		const [ condition, ...code ] = splits;

		const conditionFunctionList = getFunctionList(
			condition,
			Object.keys(funcs),
		);
		let executedCondition;
		if (conditionFunctionList.length) {
			executedCondition = Transpiler(condition, {
				sendMessage: false,
				scopeData: {
					variables: currentScope.variables,
					name: currentScope.name,
					objects: currentScope.objects,
					env: currentScope.env,
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

		let executedCode;
		const codeFunctionList = getFunctionList(
			code.join(';'),
			Object.keys(funcs),
		);
		if (codeFunctionList.length) {
			executedCode = Transpiler(code.join(';'), {
				sendMessage: false,
				scopeData: {
					variables: currentScope.variables,
					embeds: currentScope.embeds,
					name: currentScope.name,
					objects: currentScope.objects,
					env: currentScope.env,
				},
				client: currentScope.client,
			});
		} else {
			executedCode = code.join(';');
		}

		const res = escapeResult(`
while(${executedCondition}) {
   ${
	typeof executedCode === 'string'
		? executedCode
		: (executedCode as { code: string; scope: Scope[]; func: AsyncFunction })?.scope[0].toString(false)
}
}
`);
		currentScope.update( res, data );
		return { code: res, scope: scope, data };
	},
};
