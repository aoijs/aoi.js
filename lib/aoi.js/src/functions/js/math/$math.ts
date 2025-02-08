import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoiError from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult, parseResult } from '@aoi.js/utils/Helpers/core.js';
import { isMathExpression } from '@aoi.js/utils/Helpers/functions.js';

/**
 * Returns the result of a math expression
 * @example
 * ```aoi
 * ---
 * name: math
 * type: basic
 * ---
 * 
 * $math[1 + 1] // Returns 2
 * $math[ sin(90) ] // Returns 1
 * ```
 */
const $math = new FunctionBuilder()
	.setName('$math')
	.setType(FunctionType.Getter)
	.setFields([
		{
			name: 'math',
			type: ReturnType.String,
			required: true,
			description: 'The math to calculate.',
		},
	])
	.setReturns(ReturnType.Number)
	.setBrackets(true)
	.setOptional(false)
	.setCode((data, scopes, thisArg) => {
		const params = thisArg.getParams(data);
		const mathExpression = params[0];

		if (
			!mathExpression &&
			!thisArg.canSuppressAtComp(data, thisArg.getCurrentScope(scopes))
		) {
			throw AoiError.FunctionError(
				ErrorCode.MissingParameter,
				'No math expression provided.',
				data,
			);
		}

		if (
			!isMathExpression(mathExpression) &&
			!thisArg.canSuppressAtComp(data, thisArg.getCurrentScope(scopes))
		) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				'Invalid math expression provided.',
				data,
			);
		}

		const regex =
			/(abs|acos|acosh|asin|asinh|atan|atan2|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|hypot|imul|log|log10|log1p|log2|max|min|pow|random|round|sign|sin|sinh|sqrt|tan|tanh|trunc|LN10|LN2|LOG10E|LOG2E|PI|SQRT1_2|SQRT2)/g;

		const math = mathExpression
			?.replaceAll(regex, 'Math.$1')
			.replaceAll('EULERNUM', 'Math.E');
		
		if (!math && !thisArg.canSuppressAtComp(data, thisArg.getCurrentScope(scopes))) {
			throw AoiError.FunctionError(
				ErrorCode.InvalidArgumentType,
				'Invalid math expression provided.',
				data,
			);
		}

		const result = thisArg.getResultString(
			() => '$0',
			[math],
		);

		const escaped = escapeMathResult(parseResult(result));

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $math };