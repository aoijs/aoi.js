import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * runs the code on catch block
 * @example
 * ```aoi
 * ---
 * name: trycatch
 * type: basic
 * ---
 * 
 * $try[
 * 	$throw[error]
 * ]
 * $catch[
 * 	$log[$env[catchError]]
 * ]
 * $finally[
 * 	$log[finally]
 * ]
 * ```
 */
const $catch = new FunctionBuilder()
	.setName('$catch')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'code',
			type: ReturnType.String,
			required: true,
			description: 'The code to run on catch.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [code] = thisArg.getParams(data);

		const transpiler = Transpiler.instance!;

		const { result, scope } = transpiler.transpile(code, {
			sendMessage: true,
			asFunction: false,
			scopeData: {
				vars: currentScope.variables,
				name: currentScope.name,
				object: currentScope.objects,
				env: [...currentScope.env, 'catchError'],
			},
			reverse: data.cmd?.reverseRead ?? false,
			command: data.cmd,
		});

		currentScope.functions += scope.functions + '\n';
		currentScope.packages += scope.packages + '\n';

		const escaped = escapeResult(
			`catch (catchError) {
				${result}
			}`,
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $catch };
