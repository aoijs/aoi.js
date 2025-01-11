import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import {
	ErrorCode,
	FunctionType,
	ReturnType,
	TranspilerCustoms,
} from '@aoi.js/typings/enum.js';
import { escapeResult, parseResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the maximum number from the given numbers
 * @example
 * ```aoi
 * ---
 * name: max
 * type: basic
 * ---
 *
 * $max[1;2;3] // Returns 3
 * $max[1;2;3;4] // Returns 4
 * ```
 */
const $max = new FunctionBuilder()
	.setName('$max')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([
		{
			name: 'numbers',
			type: ReturnType.Number | ReturnType.Array,
			required: true,
			description: 'Numbers to compare',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const numbers = thisArg.getParams(data);

		if (!numbers.length && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'Missing parameters',
				data,
			);
		}

		const nums = numbers.map((num) => {
			if (
				num.includes(TranspilerCustoms.FS) ||
				num.includes(TranspilerCustoms.MFS) ||
				num.includes('__$DISCORD_DATA$__')
			)
				return parseResult(num);
			return Number(num);
		});

		const resultString = thisArg.getResultString(
			() => Math.max('$0' as unknown as number),
			[nums.toString()],
		);

		const escaped = escapeResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $max };
