import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, parseData } from '@aoi.js/utils/Helpers/core.js';
import { formatTime, humanizeMs } from '@aoi.js/utils/Helpers/timeformat.js';

/**
 * Parses humanize date or time into milliseconds
 * @example
 * ```aoi
 * ---
 * name: parsetime
 * type: function
 * ---
 * 
 * $parsetime[1 day] // returns 86400000
 * $parsetime[1 hour] // returns 3600000
 * ```
 */
const $parsetime = new FunctionBuilder()
	.setName('$parsetime')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.FunctionGetter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'humanize date or time in ms',
			type: ReturnType.String,
			required: true,
			description: 'The humanize date to parse into milliseconds.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [time] = thisArg.getParams(data);

		if (!time && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid type for parameter 'humanize date' in function $parsetime, got: ${time} expected: string`,
				data,
			);
		}

		if (!thisArg.hasFunction(currentScope, formatTime.name)) {
			thisArg.addFunction(currentScope, formatTime);
		}

		const parsedTime = parseData(time) as string | number;

		const escaped = escapeResult(
			thisArg.getResultString(
				() =>
					formatTime(
						'$0' as unknown as string,
						'$1' as unknown as string,
						'$2' as unknown as string,
					).ms,
				[
					typeof parsedTime === 'number' ? parsedTime.toString() : parseString(parsedTime.toString()),
					parseString(currentScope.dateTimeOptions.locale),
					parseString(currentScope.dateTimeOptions.timezone),
				],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $parsetime };
