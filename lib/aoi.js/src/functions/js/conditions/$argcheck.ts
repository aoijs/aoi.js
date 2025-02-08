import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Checks if the message argument length meets the condition
 * @example
 * ```aoi
 * ---
 * name: argcheck
 * type: basic
 * ---
 * 
 * $argcheck[>1;stop] // stops the code if the message argument length is less than 2
 * ```
 */
const $argcheck = new FunctionBuilder()
	.setName('$argcheck')
	.setBrackets(true)
	.setOptional(false)
	.setReturns(ReturnType.Void)
	.setType(FunctionType.Scope)
	.setFields([
		{
			name: 'args condition',
			type: ReturnType.Any,
			required: true,
			description: 'The condition to check on the arguments.',
		},
		{
			name: 'code',
			type: ReturnType.Any,
			required: true,
			description: 'The code to run if the condition is false.',
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

		const conditionToCheck = parseCondition(
			`(__$DISCORD_DATA$__.args?.length ?? 0)${conditionResult}`,
		).solve();

		const hash = Math.random().toString(36).substring(7);

		const { result: codeResult, scope: codeScope } = transpiler.transpile(
			joinedCode,
			{
				sendMessage: true,
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

		const result = thisArg.getResultString(() => {
			// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
			// @ts-ignore
			// eslint-disable-next-line no-constant-condition
			if (!('$0')) {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				'$1';
			}
		}, [conditionToCheck, codeResult]);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $argcheck };