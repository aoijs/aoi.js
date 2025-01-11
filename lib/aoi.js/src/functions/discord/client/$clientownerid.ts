import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the id of the bot's owner.
 * @example
 * ```aoi
 * ---
 * name: clientownerid
 * type: basic
 * ---
 * 
 * $clientownerid // Returns the id of the bot's owner
 * ```
 */
const $clientownerid = new FunctionBuilder()
	.setName('$clientownerid')
	.setBrackets(false)
	.setFields([])
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setCode((data, scopes, thisArg) => {
		const resultString = thisArg.getResultString(
			(discordData) => discordData.client.application?.owner?.id,
		);
		const escaped = escapeResult(resultString);
		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $clientownerid };
