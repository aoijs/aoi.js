import FunctionBuilder from '@aoi.js/core/builders/Function.js';
<<<<<<< HEAD
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
=======
import { TranspilerError } from '@aoi.js/core/Error.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult } from '@aoi.js/utils/Helpers/core.js';

>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
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
<<<<<<< HEAD
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Provided argument is not a number, received ${number}`,
=======
			throw TranspilerError.CompileError(
				`Provided number is not a number, received ${number}`,
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
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
