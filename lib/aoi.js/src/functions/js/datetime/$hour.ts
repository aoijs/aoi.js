import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the current hour
 * @example
 * ```aoi
 * ---
 * name: hour
 * type: basic
 * ---
 * 
 * $hour // returns the current hour ( from 0 to 23 with 24-hour format )
 * ```
 */
const $hour = new FunctionBuilder()
	.setName('$hour')
	.setBrackets(false)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);

		const escaped = escapeResult(
			thisArg.getResultString(
				() =>
					Number(
						new Date().toLocaleString('$0', {
							timeZone: '$1',
							hour12: '$2' as unknown as boolean,
							hour: 'numeric',
						}),
					),
				[
					parseString(currentScope.dateTimeOptions.locale),
					parseString(currentScope.dateTimeOptions.timezone),
					currentScope.dateTimeOptions.hour12 ? 'true' : 'false',
				],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $hour };
