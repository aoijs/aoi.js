import { type FunctionData, type funcData, Scope, TranspilerError, Transpiler, conditionLexer } from '../../../index.js';
import funcs from '../../index.js';
import { getFunctionList, escapeFunctionResult } from '../../../util/transpilerHelpers.js';

export const $if: FunctionData = {
	name: '$if',
	brackets: true,
	optional: false,
	type: 'scope',
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
			description: 'The code to execute if the if statement is true',
			required: true,
		},
	],
	version: '7.0.0',
	default: ['void', 'void'],
	returns: 'void',
	description: 'If statement',
	example: `
        $if[$ping<100;
        $log[ping is less than 100]
    ]
    $elseIf[$ping<200;
        $log[ping is less than 200]
    ]
    $else[
        $log[ping is greater than 200]
    ]
    `,
	code: (data: funcData, scope: Scope[]) => {
		const splits = data.splits;
		const currentScope = scope[scope.length - 1];
		if ($if.brackets) {
			if (
				!data.total.startsWith($if.name + '[') &&
                (!currentScope.name.startsWith('$try_') ||
                    !currentScope.name.startsWith('$catch_'))
			) {
				throw new TranspilerError(
					`${data.name} requires closure brackets`,
				);
			}
		}

		const [condition, ...errorMsg] = splits;
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

		const hash = Math.floor(Math.random() * 100000);
		const newscope = new Scope(
			`${data.name}_${hash}`,
			currentScope.client,
			currentScope.name,
			errorMsg.join(';'),
			true,
		);

		let executedErrorMsg;
		const errorMsgFunctionList = getFunctionList(
			errorMsg.join(';'),
			Object.keys(funcs),
		);
		if (errorMsgFunctionList.length) {
			executedErrorMsg = Transpiler(errorMsg.join(';'), {
				sendMessage: true,
				scopeData: {
					variables: currentScope.variables,
					embeds: currentScope.embeds,
					name: currentScope.name,
					objects: currentScope.objects,
					env: currentScope.env,
				},
				client: currentScope.client,
			});
			newscope.functions = executedErrorMsg.scope[0].functions + '\n';
			newscope.packages = executedErrorMsg.scope[0].packages + '\n';
			newscope.setters = executedErrorMsg.scope[0].setters + '\n';
			executedErrorMsg.scope[0].addReturn = true;
			newscope.rest = executedErrorMsg.scope[0].rest + '\n';
			newscope.sendData = executedErrorMsg.scope[0].sendData;
		} else {
			executedErrorMsg = errorMsg.join(';');
			newscope.rest = executedErrorMsg + '\n';
			newscope.sendData.content = executedErrorMsg;
		}

		const res = escapeFunctionResult(`
    if(${executedCondition}) {
      ${newscope.toString()}
    }
    `);
		currentScope.update( res, data );
		return {
			code: res,
			scope: scope,
			data,
		};
	},
};
