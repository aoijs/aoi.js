import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType, TranspilerCustoms } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult, parseResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the sum of numbers
 * @example
 * ```aoi
 * ---
 * name: sum
 * type: basic
 * ---
 * 
 * $sum[1;2;3] // Returns 6
 * $sum[1;2;3;4] // Returns 10
 * ```
 */
const $sum = new FunctionBuilder()
	.setName('$sum')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([{
		name: 'numbers',
		type: ReturnType.Number | ReturnType.Array,
		required: true,
		description: 'The numbers to get sumation of.',
	}])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const numbers = thisArg.getParams(data);

		if (!numbers.length && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(ErrorCode.MissingParameter, 'Missing numbers to add.', data);
		}

		const add = numbers.map(num => {
			if (num.includes(TranspilerCustoms.FS) || num.includes(TranspilerCustoms.MFS) || num.includes('__$DISCORD_DATA$__')) return parseResult(num);
			return Number(num);
		}).join(' + ');

		const escaped = escapeMathResult(add);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $sum };
