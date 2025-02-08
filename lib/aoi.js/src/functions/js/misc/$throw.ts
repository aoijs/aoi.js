import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * throws an error and stops the execution of the code
 * @example
 * ```aoi
 * ---
 * name: throw
 * type: basic
 * ---
 * 
 * $throw[Error]
 * $log[This will not be executed]
 * ```
 */
const $throw = new FunctionBuilder()
	.setName('$throw')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Function)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'value',
			type: ReturnType.String,
			required: false,
			description: 'The value to throw.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [value] = thisArg.getParams(data);

		const parsedValue = thisArg.parseData(value, ReturnType.String);

		if (!thisArg.isCorrectType(parsedValue, ReturnType.String) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid argument type 'value' in function $throw, got ${value}, expected ReturnType.${ReturnType[ReturnType.String]}`,
				data,
			);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				() => {
					throw new Error('"$0"');
				},
				[parsedValue],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $throw };
