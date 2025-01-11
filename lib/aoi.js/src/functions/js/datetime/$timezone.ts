import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { isValidTimeZone } from '@aoi.js/utils/Helpers/timeformat.js';

/**
 *	Changes the timezone or returns the current timezone
 * @example
 * ```aoi
 * ---
 * name: timezone
 * type: basic
 * ---
 * 
 * $timezone[Asia/Tokyo]
 * // changes the timezone to Asia/Tokyo
 * $timezone
 * // returns the current timezone
 * ```
 */
const $timezone = new FunctionBuilder()
	.setName('$timezone')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'timezone',
			type: ReturnType.String,
			required: false,
			description:
				'The timezone to use. if not provided, returns the current timezone.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [timezone] = thisArg.getParams(data);

		let escaped: string;
		if (!timezone) {
			escaped = escapeResult(
				thisArg.getResultString(
					() => '$0',
					[parseString(currentScope.dateTimeOptions.timezone)],
				),
			);
		} else {
			escaped = '';
			//check if timezone is valid
			if (!isValidTimeZone(timezone)) {
				throw AoijsErrorHandler.FunctionError(
					ErrorCode.InvalidTimeZone,
					`Timezone '${timezone}' is not a valid timezone.`,
					data,
				);
			}

			currentScope.dateTimeOptions.timezone = timezone;
		}

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $timezone };
