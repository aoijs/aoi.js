import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the current working directory of the process.
 * @example
 * ```aoi
 * ---
 * name: cwd
 * type: basic
 * ---
 * 
 * $cwd // <RootDir>/<indexFile>.js
 * ```
 */
const $cwd = new FunctionBuilder()
	.setName('$cwd')
	.setBrackets(false)
	.setOptional(false)
	.setFields([])
	.setReturns(ReturnType.String)
	.setType(FunctionType.Getter)
	.setCode((data, scopes, thisArg) => {
		const result = thisArg.getResultString(
			() => process.cwd(),
		);
		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $cwd };