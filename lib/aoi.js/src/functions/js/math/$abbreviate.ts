import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { abbreviate } from '@aoi.js/utils/Helpers/functions.js';

/**
 * Returns the abbreviation of provided value to decimal place
 * @example
 * ```aoi
 * ---
 * name: abbreviate
 * type: basic
 * ---
 *
 * $abbreviate[20000;2] // returns 2.00K
 * ```
 */

const $abbreviate = new FunctionBuilder()
	.setName('$abbreviate')
	.setBrackets(true)
	.setOptional(false)
	.setFields([
		{
			name: 'number',
			type: ReturnType.Number,
			required: true,
			description: 'The number to abbreviate.',
		},
		{
			name: 'decimals',
			type: ReturnType.Number,
			required: false,
			description: 'The number of decimals to keep. Defaults to 2.',
		},
	])
	.setReturns(ReturnType.String)
	.setType(FunctionType.FunctionGetter)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [number, decimals = '2'] = thisArg.getParams(data);

		const parsedDecimal = Number(decimals ?? 2);
		const parsedNumber = Number(number);

		if (
			isNaN(parsedNumber) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Provided number argument is not a number, received ${number}`,
				data,
			);
		}

		if (
			isNaN(parsedDecimal) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Provided number is not a valid decimal position, received ${decimals}`,
				data,
			);
		}

		thisArg.addFunction(currentScope, abbreviate);
		const resultString = thisArg.getResultString(
			// @ts-expect-error - intended behaviour
			() => abbreviate('$0', '$1'),
			[parsedNumber.toString(), parsedDecimal.toString()],
		);

		const result = escapeResult(resultString);

		return {
			code: result,
			scope: scopes,
		};
	})
	.build();

export { $abbreviate };
