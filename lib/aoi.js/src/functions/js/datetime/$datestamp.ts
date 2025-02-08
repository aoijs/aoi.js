import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the current datestamp
 * @example
 * ```aoi
 * ---
 * name: datestamp
 * type: basic
 * ---
 * 
 * $datestamp // returns the current datestamp
 * ```
 */
const $datestamp = new FunctionBuilder()
	.setName('$datestamp')
	.setBrackets(false)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([])
	.setCode((data, scopes, thisArg) => {
		const escaped = escapeResult(thisArg.getResultString(() => Date.now()));

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $datestamp };
