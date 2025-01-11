import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import {
	ErrorCode,
	FunctionType,
	ReturnType,
	TranspilerCustoms,
} from '@aoi.js/typings/enum.js';
import {
	escapeMathResult,
	escapeResult,
	parseResult,
} from '@aoi.js/utils/Helpers/core.js';

/**
 * Divides the numbers
 * @example
 * ```aoi
 * ---
 * name: divide
 * type: basic
 * ---
 * 
 * $divide[10;5] // Returns 2
 * $divide[10;5;2] // Returns 1 
 * ```
 */
const $divide = new FunctionBuilder()
	.setName('$divide')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([
		{
			name: 'numbers',
			type: ReturnType.Number | ReturnType.Array,
			required: true,
			description: 'The numbers to divide.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const numbers = thisArg.getParams(data);

		if (!numbers.length && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing numbers to calculate division.',
				data,
			);
		}

		const divide = numbers
			.map((num) => {
				if (
					num.includes(TranspilerCustoms.FS) ||
					num.includes(TranspilerCustoms.MFS) ||
					num.includes('__$DISCORD_DATA$__')
				)
					return parseResult(num);
				return Number(num);
			})
			.join(' / ');

		const escaped = escapeMathResult(divide);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $divide };
