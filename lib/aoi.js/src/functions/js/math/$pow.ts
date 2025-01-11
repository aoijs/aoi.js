import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType, TranspilerCustoms } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult, parseResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the exponential of a number
 * @example
 * ```aoi
 * ---
 * name: pow
 * type: basic
 * ---
 * 
 * $pow[2;3] // Returns 8
 * $pow[2;3;2] // Returns 512
 * ```
 */
const $pow = new FunctionBuilder()
	.setName('$pow')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([{
		name: 'numbers',
		type: ReturnType.Number | ReturnType.Array,
		required: true,
		description: 'The numbers to get exponential of.',
	}])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const numbers = thisArg.getParams(data);

		if (!numbers.length && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(ErrorCode.MissingParameter, 'Missing numbers to calculate exponential.', data);
		}

		const pow = numbers.map(num => {
			if (num.includes(TranspilerCustoms.FS) || num.includes(TranspilerCustoms.MFS) || num.includes('__$DISCORD_DATA$__')) return parseResult(num);
			return Number(num);
		}).join(' ** ');

		const escaped = escapeMathResult(pow);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $pow };
