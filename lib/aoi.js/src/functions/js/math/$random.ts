import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { randomFromRange } from '@aoi.js/utils/Helpers/functions.js';

/**
 * Returns a random number between the provided range
 * @example
 * ```aoi
 * ---
 * name: random
 * type: basic
 * ---
 * 
 * $random[1;10] // Returns a random number between 1 and 10
 * $random[1;10;true] // Returns a random decimal number between 1 and 10
 * ```
 */
const $random = new FunctionBuilder()
	.setName('$random')
	.setBrackets(true)
	.setOptional(false)
	.setFields([
		{
			name: 'min',
			type: ReturnType.Number,
			required: false,
			description: 'the minimum number to generate',
		},
		{
			name: 'max',
			type: ReturnType.Number,
			required: false,
			description: 'the maximum number to generate',
		},
		{
			name: 'allowDecimal',
			type: ReturnType.Boolean,
			required: false,
			description: 'allow the number to be a decimal',
		},
	])
	.setType(FunctionType.FunctionGetter)
	.setReturns(ReturnType.Number)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [min, max, allowDecimal = 'false'] = thisArg.getParams(data);
		const parsedMin = Number(min);
		const parsedMax = Number(max);
		const parsedAllowDecimal = allowDecimal === 'true';

		if ((!min || !max) && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameters',
				data,
			);
		}

		if (
			isNaN(parsedMin) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Provided min argument is not a number, received ${min}`,
				data,
			);
		}

		if (
			isNaN(parsedMax) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Provided max argument is not a number, received ${max}`,
				data,
			);
		}

		if (
			parsedMin > parsedMax &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Provided min argument is greater than max argument, received min: ${min}, max: ${max}`,
				data,
			);
		}

		if (!thisArg.hasFunction(currentScope, randomFromRange.name)) {
			thisArg.addFunction(currentScope, randomFromRange);
		}

		const resultString = thisArg.getResultString(
			() =>
				randomFromRange(
					'$0' as unknown as number,
					'$1' as unknown as number,
					'$2' as unknown as boolean,
				),
			[
				parsedMin.toString(),
				parsedMax.toString(),
				parsedAllowDecimal.toString(),
			],
		);

		const escaped = escapeMathResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $random };
