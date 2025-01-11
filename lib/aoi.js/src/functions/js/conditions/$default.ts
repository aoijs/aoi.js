import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Executes the code if all cases are false
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
const $default = new FunctionBuilder()
	.setName('$default')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'code',
			type: ReturnType.Any,
			required: true,
			description: 'The code to execute on default case.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [...code] = thisArg.getParams(data);
		const joinedCode = code.join(';');
		const transpiler = Transpiler.instance!;

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

		const escaped = escapeResult(
			`default: {
			${codeResult}
			break;
		}`,
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $default };
