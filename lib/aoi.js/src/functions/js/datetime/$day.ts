import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the current day
 * @example
 * ```aoi
 * ---
 * name: day
 * type: basic
 * ---
 * 
 * $day // returns the current day ( from 1 to 31 )
 * ```
 */
const $day = new FunctionBuilder()
	.setName('$day')
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
							day: 'numeric',
						}),
					),
				[
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

export { $day };
