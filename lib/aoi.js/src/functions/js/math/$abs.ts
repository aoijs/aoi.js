import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the absolute value of a number
 * @example
 * ```aoi
 * ---
 * name: abs
 * type: basic
 * ---
 * 
 * $abs[-5] // Returns 5
 * $abs[5] // Returns 5
 * ```
 */
const $abs = new FunctionBuilder()
	.setName('$abs')
	.setBrackets(true)
	.setOptional(false)
	.setFields([
		{
			name: 'number',
			type: ReturnType.Number,
			required: true,
			description: 'the number to get absolute value',
		},
	])
	.setReturns(ReturnType.Number)
	.setType(FunctionType.Getter)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);

		const [number] = thisArg.getParams(data);
		const parsedNumber = Number(number);

		if (
			isNaN(parsedNumber) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Provided argument is not a number, received ${number}`,
				data,
			);
		}

		const resultString = thisArg.getResultString(
			() => Math.abs('$0' as unknown as number),
			[parsedNumber.toString()],
		);

		const escaped = escapeMathResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $abs };
