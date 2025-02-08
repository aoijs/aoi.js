import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the id of the author.
 * @example
 * ```aoi
 * ---
 * name: authorid
 * type: basic
 * ---
 * 
 * $authorid // returns the id of the author
 * ```
 */
const $authorid = new FunctionBuilder()
	.setName('$authorid')
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String | ReturnType.Void)
	.setBrackets(false)
	.setOptional(false)
	.setFields([])
	.setCode((data, scopes, thisArg) => {

		const result = thisArg.getResultString(
			(discordData) => discordData.author?.id,
		);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
        
	})
	.build();

export { $authorid };