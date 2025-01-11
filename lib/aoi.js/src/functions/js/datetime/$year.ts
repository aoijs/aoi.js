import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the current year
 * @example
 * ```aoi
 * ---
 * name: year
 * type: basic
 * ---
 * 
 * $year // returns the current year
 * ```
 */
const $year = new FunctionBuilder()
	.setName('$year')
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
						new Date().toLocaleDateString('$0', {
							timeZone: '$1',
							year: 'numeric',
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

export { $year };