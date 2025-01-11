import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Rounds the number to the nearest integer or to the specified number of decimals
 * @example
 * ```aoi
 * ---
 * name: round
 * type: basic
 * ---
 * 
 * $round[5.5] // Returns 6
 * $round[5.47;1] // Returns 5.5
 * ```
 */
const $round = new FunctionBuilder()
	.setName('$round')
	.setBrackets(true)
	.setOptional(false)
	.setFields([
		{
			name: 'number',
			type: ReturnType.Number,
			required: true,
			description: 'the number to get rounded of',
		},
		{
			name: 'decimals',
			type: ReturnType.Number,
			required: false,
			description: 'The number of decimals to keep. Defaults to 0.',
		},
	])
	.setReturns(ReturnType.Number)
	.setType(FunctionType.Getter)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);

		const [number, decimals = '0'] = thisArg.getParams(data);

		const parsedDecimal = thisArg.parseData(decimals, ReturnType.Number);
		const parsedNumber = thisArg.parseData(number, ReturnType.Number);

		if (
			!thisArg.isCorrectType(parsedNumber, ReturnType.Number) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Provided number argument is not a number, received ${number}`,
				data,
			);
		}

		if (
			!thisArg.isCorrectType(parsedDecimal, ReturnType.Number) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Provided number is not a valid decimal position, received ${decimals}`,
				data,
			);
		}


		let resultString;
		if (parsedDecimal === 0) {
			resultString = thisArg.getResultString(
				() => Math.round('$0' as unknown as number),
				[parsedNumber.toString()],
			);
		} else {
			resultString = thisArg.getResultString(
				() => Number(Number(('$0' as unknown as number)).toFixed('$1' as unknown as number)),
				[parsedNumber.toString(), parsedDecimal.toString()],
			);
		}

		const escaped = escapeMathResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $round };
