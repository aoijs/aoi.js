import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the current month
 * @example
 * ```aoi
 * ---
 * name: month
 * type: basic
 * ---
 * 
 * $month // returns the current month ( from January to December )
 * ```
 */
const $month = new FunctionBuilder()
	.setName('$month')
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
						month: 'long',
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

export { $month };