import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * increments the value of a variable
 * @example
 * ```aoi
 * ---
 * name: inc
 * type: basic
 * ---
 *
 * $try[
 * 	$throw[Error]
 * ] $catch[
 * 	$log[catches error: $inc[catchError] // catches error: Error
 * ]
 * ```
 */
const $inc = new FunctionBuilder()
	.setName('$inc')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Any)
	.setFields([
		{
			name: 'variable',
			type: ReturnType.String,
			required: true,
			description: 'The variable to be incremented.',
		},
		{
			name: 'incrementFunction',
			type: ReturnType.Fn,
			required: false,
			description: 'The function to increment the variable.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		let [variable, incFn] = thisArg.getParams(data);

		if (!variable && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameter \'inc\' in function $inc',
				data,
			);
		}

		if (
			!currentScope.variables.includes(variable) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.VariableNotFound,
				`Invalid variable '${variable}' in function $inc`,
				data,
			);
		}

		if (!incFn) incFn = '++';

		const escaped = escapeResult(`${variable}${incFn}`);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $inc };
