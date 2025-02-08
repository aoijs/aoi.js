import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the ceiling of a number
 * @example
 * ```aoi
 * ---
 * name: ceil
 * type: basic
 * ---
 * 
 * $ceil[1.1] // Returns 2
 * $ceil[1.9] // Returns 2
 * $ceil[-1.1] // Returns -1
 * ```
 */
const $ceil = new FunctionBuilder()
	.setName('$ceil')
	.setBrackets(true)
	.setOptional(false)
	.setFields([
		{
			name: 'number',
			type: ReturnType.Number,
			required: true,
			description: 'the number to get ceiling of, ie. 1.1 -> 2',
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
			() => Math.ceil('$0' as unknown as number),
			[parsedNumber.toString()],
		);

		const escaped = escapeMathResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $ceil };
