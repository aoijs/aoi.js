import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { formatTime, humanizeMs } from '@aoi.js/utils/Helpers/timeformat.js';

/**
 * Parses milliseconds into a date or time
 * @example
 * ```aoi
 * ---
 * name: parsedate
 * type: function
 * ---
 * 
 * $parsedate[1000;time] // returns 1 second
 * $parsedate[$datestamp;date] // returns the current date
 * ```
 */
const $parsedate = new FunctionBuilder()
	.setName('$parsedate')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.FunctionGetter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'ms',
			type: ReturnType.Number,
			required: true,
			description: 'The milliseconds to parse.',
		},
		{
			name: 'type',
			type: ReturnType.String,
			required: false,
			description:
				'The type of parsing to use. options: "date"and "time"',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [ms, type] = thisArg.getParams(data);

		const parsedMs = thisArg.parseData(ms, ReturnType.Number);
		if (!parsedMs && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'ms' in function $parsedate, got: ${parsedMs} expected: number`,
				data,
			);
		}

		let parsedType = type || 'time';

		if (!thisArg.hasFunction(currentScope, formatTime.name)) {
			thisArg.addFunction(currentScope, formatTime);
		}
		
		if (!thisArg.hasFunction(currentScope, humanizeMs.name)) {
			thisArg.addFunction(currentScope, humanizeMs);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				() =>
					formatTime(
						// @ts-expect-error: ignore
						// eslint-disable-next-line no-constant-condition
						'$3' === 'time' ? humanizeMs('$0' as unknown as number) : '$0',
						'$1' as unknown as string,
						'$2' as unknown as string,
					).format,
				[
					parsedMs.toString(),
					parseString(currentScope.dateTimeOptions.locale),
					parseString(currentScope.dateTimeOptions.timezone),
					parseString(parsedType),
				],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $parsedate };
