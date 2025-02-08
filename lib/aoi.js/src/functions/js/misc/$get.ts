import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, escapeVars } from '@aoi.js/utils/Helpers/core.js';

/**
 * access the value from the defined variable
 * @example
 * ```aoi
 * ---
 * name: letget
 * type: basic
 * ---
 * 
 * $let[v;value]
 * $get[v] // returns value
 * ```
 */
const $get = new FunctionBuilder()
	.setName('$get')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Any)
	.setFields([
		{
			name: 'variable',
			type: ReturnType.String,
			required: true,
			description: 'The variable to get.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [variable] = thisArg.getParams(data);

		if (!currentScope.hasVariable(variable) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.VariableNotFound,
				`Variable '${variable}' not found.`,
				data,
			);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				() => '$0',
				[escapeVars(variable)],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $get };
