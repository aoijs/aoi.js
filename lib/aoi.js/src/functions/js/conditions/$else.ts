import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Executes the else block if the condition is false
 * @example
 * ```aoi
 * ---
 * name: if
 * type: basic
 * ---
 * 
 * $if[$message[1]==hi; hello]
 * $elseif[$message[1]==bye; goodbye]
 * $else[good day]
 * ```
 */
const $else = new FunctionBuilder()
	.setName('$else')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'code',
			type: ReturnType.Any,
			required: true,
			description: 'The code to execute else the condition is true.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [code] = thisArg.getParams(data);
		const transpiler = Transpiler.instance!;
		const hash = Math.random().toString(36).substring(7);

		const { result: codeResult, scope: codeScope } = transpiler.transpile(
			code,
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

		const result = `
else {
${codeResult}
}		
`;

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $else };
