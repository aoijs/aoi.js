import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the current weekday
 * @example
 * ```aoi
 * ---
 * name: weekday
 * type: basic
 * ---
 * 
 * $weekday // returns the current weekday ( e.g. Monday )
 * ```
 */
const $weekday = new FunctionBuilder()
	.setName('$weekday')
	.setBrackets(false)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);

		const escaped = escapeResult(
			thisArg.getResultString(
				() =>
					new Date().toLocaleString('$0', {
						timeZone: '$1',
						weekday: 'long',
					}),
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

export { $weekday };