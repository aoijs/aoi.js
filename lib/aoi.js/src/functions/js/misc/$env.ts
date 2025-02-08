import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * access the internal variable of the scope
 * @example
 * ```aoi
 * ---
 * name: env
 * type: basic
 * ---
 * 
 * $try[
 * 	$throw[Error]
 * ] $catch[
 * 	$log[catches error: $env[catchError] // catches error: Error
 * ]
 * ```
 */
const $env = new FunctionBuilder()
	.setName('$env')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Any)
	.setFields([
		{
			name: 'env',
			type: ReturnType.String,
			required: true,
			description: 'The env of the environment variable to get.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [env] = thisArg.getParams(data);
		
		if (!env && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'env\' in function $env',
				data,
			);
		}

		const mainenv = env.split('.')[0];
		
		if (!currentScope.env.includes(mainenv) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidEnv,
				`Invalid env '${mainenv}' in function $env`,
				data,
			);
		}

		const escaped = escapeResult(env);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $env };