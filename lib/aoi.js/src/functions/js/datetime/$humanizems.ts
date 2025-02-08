import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { humanizeMs } from '@aoi.js/utils/Helpers/timeformat.js';

/**
 * Humanizes milliseconds
 * @example
 * ```aoi
 * $humanizems[1000]
 * // returns 1s
 * ```
 */
const $humanizems = new FunctionBuilder()
	.setName('$humanizems')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.FunctionGetter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'ms',
			type: ReturnType.Number,
			required: true,
			description: 'The milliseconds to humanize.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [ms] = thisArg.getParams(data);

		const parsedMs = thisArg.parseData(ms, ReturnType.Number);
		if (!parsedMs && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				//`Invalid type for parameter 'end' in function $for, got: ${parsedEnd} expected: number`,
				`Invalid type for parameter 'ms' in function $humanizems, got: ${parsedMs} expected: number`,
				data,
			);
		}

		if (!thisArg.hasFunction(currentScope, humanizeMs.name)) {
			thisArg.addFunction(currentScope, humanizeMs);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				() =>  humanizeMs('$0' as unknown as number),
				[parsedMs.toString()],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $humanizems };