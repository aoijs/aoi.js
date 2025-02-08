import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Creates a switch statement
 * @example
 * ```aoi
 * ---
 * name: switch
 * type: basic
 * ---
 * 
 * $switch[$message[1];
 *  $case[hi; hello]
 *  $case[bye; goodbye]
 *  $default[good day]
 * ]
 * ```
 */
const $switch = new FunctionBuilder()
	.setName('$switch')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'condition',
			type: ReturnType.Boolean,
			required: true,
			description: 'The condition to check.',
		},
		{
			name: 'code',
			type: ReturnType.Any,
			required: true,
			description: 'The code to execute switch the condition is true.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [condition, ...code] = thisArg.getParams(data);
		const joinedCode = code.join(';');
		const transpiler = Transpiler.instance!;

		const { result: conditionResult, scope: conditionScope } =
			transpiler.transpile(condition, {
				sendMessage: false,
				asFunction: false,
				scopeData: {
					vars: currentScope.variables,
					name: currentScope.name,
					object: currentScope.objects,
					env: currentScope.env,
				},
				reverse: data.cmd?.reverseRead ?? false,
				command: data.cmd,
			});

		currentScope.functions += conditionScope.functions + '\n';
		currentScope.packages += conditionScope.packages + '\n';

		const conditionToCheck = parseCondition(conditionResult).solve();

		const hash = Math.random().toString(36).substring(7);

		const { result: codeResult, scope: codeScope } = transpiler.transpile(
			joinedCode,
			{
				sendMessage: false,
				asFunction: false,
				scopeData: {
					vars: currentScope.variables,
					name: `${data.name}_${hash}`,
					object: currentScope.objects,
					env: currentScope.env,
				},
				reverse: data.cmd?.reverseRead ?? false,
				command: data.cmd,
			},
		);

		currentScope.functions += codeScope.functions + '\n';
		currentScope.packages += codeScope.packages + '\n';

		const escaped = escapeResult(
			`switch (${conditionToCheck}) {
			${codeResult}
}`,
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $switch };
