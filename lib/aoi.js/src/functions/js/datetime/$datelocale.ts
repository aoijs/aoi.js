import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { isValidDateLocale } from '@aoi.js/utils/Helpers/timeformat.js';

/**
 *	Changes the datelocale or returns the current datelocale
 * @example
 * ```aoi
 * ---
 * name: datelocale
 * type: basic
 * ---
 * 
 * $datelocale[en-US]
 * // changes the datelocale to en-US
 * $datelocale
 * // returns the current datelocale
 * ```
 */
const $datelocale = new FunctionBuilder()
	.setName('$datelocale')
	.setBrackets(true)
	.setOptional(true)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'datelocale',
			type: ReturnType.String,
			required: false,
			description:
				'The datelocale to use. if not provided, returns the current datelocale.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [datelocale] = thisArg.getParams(data);

		let escaped: string;
		if (!datelocale) {
			escaped = escapeResult(
				thisArg.getResultString(
					() => '$0',
					[parseString(currentScope.dateTimeOptions.locale)],
				),
			);
		} else {
			escaped = '';
			//check if datelocale is valid
			if (!isValidDateLocale(datelocale)) {
				throw AoijsErrorHandler.FunctionError(
					ErrorCode.InvalidTimeZone,
					`Date Locale '${datelocale}' is not a valid locale.`,
					data,
				);
			}

			currentScope.dateTimeOptions.locale = datelocale;
		}

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $datelocale };
