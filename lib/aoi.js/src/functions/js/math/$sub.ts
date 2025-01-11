import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType, TranspilerCustoms } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult, parseResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Subtracts the numbers
 * @example
 * ```aoi
 * ---
 * name: sub
 * type: basic
 * ---
 * 
 * $sub[10;5] // Returns 5
 * $sub[10;5;2] // Returns 3
 * ```
 */
const $sub = new FunctionBuilder()
	.setName('$sub')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([{
		name: 'numbers',
		type: ReturnType.Number | ReturnType.Array,
		required: true,
		description: 'The numbers to get subtraction of.',
	}])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const numbers = thisArg.getParams(data);

		if (!numbers.length && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(ErrorCode.MissingParameter, 'Missing numbers to sub.', data);
		}

		const sub = numbers.map(num => {
			if (num.includes(TranspilerCustoms.FS) || num.includes(TranspilerCustoms.MFS) || num.includes('__$DISCORD_DATA$__')) return parseResult(num);
			return Number(num);
		}).join(' - ');

		const escaped = escapeMathResult(sub);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $sub };
