import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Executes the code onlyif the condition is true
 * @example
 * ```aoi
 * ---
 * name: onlyif
 * type: basic
 * ---
 * 
 * $onlyif[$message[1]==hi; say hi to me :(]
 * hi
 * ```
 */
const $onlyif = new FunctionBuilder()
	.setName('$onlyif')
	.setBrackets(true)
	.setOptional(false)
	.setReturns(ReturnType.Void)
	.setType(FunctionType.Scope)
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
			description: 'The code to run if the condition is false.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [condition, ...code] = thisArg.getParams(data);
		const joined = code.join(';');

		const transpiler = Transpiler.instance!;

		const { ast: conditionAst, scope: conditionScope } =
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

		const conditionResult = conditionAst.executed;
		const conditionToCheck = parseCondition(conditionResult).solve();

		const hash = Math.random().toString(36).substring(7);

		const { result: codeResult, scope: codeScope } = transpiler.transpile(
			joined,
			{
				sendMessage: true,
				asFunction: false,
				scopeData: {
					vars: currentScope.variables,
					name: `${data.name}_${hash}`,
					object: currentScope.objects,
					env: currentScope.env,
					addReturn: true,
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
				return;
			}
		}, [conditionToCheck, codeResult]);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $onlyif };
