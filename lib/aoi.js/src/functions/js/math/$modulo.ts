import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType, TranspilerCustoms } from '@aoi.js/typings/enum.js';
import { escapeMathResult, escapeResult, parseResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the modulo of the numbers
 * @example
 * ```aoi
 * ---
 * name: modulo
 * type: basic
 * ---
 * 
 * $modulo[10;5] // Returns 0
 * $modulo[10;3] // Returns 1
 * ```
 */
const $modulo = new FunctionBuilder()
	.setName('$modulo')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([{
		name: 'numbers',
		type: ReturnType.Number | ReturnType.Array,
		required: true,
		description: 'The numbers to get modulo of.',
	}])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const numbers = thisArg.getParams(data);

		if (!numbers.length && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(ErrorCode.MissingParameter, 'Missing numbers to calculate modulo.', data);
		}

		const modulo = numbers.map(num => {
			if (num.includes(TranspilerCustoms.FS) || num.includes(TranspilerCustoms.MFS) || num.includes('__$DISCORD_DATA$__')) return parseResult(num);
			return Number(num);
		}).join(' % ');

		const escaped = escapeMathResult(modulo);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $modulo };
