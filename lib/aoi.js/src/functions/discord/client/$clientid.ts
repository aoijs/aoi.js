import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the id of the bot.
 * @example
 * ```aoi
 * ---
 * name: clientid
 * type: basic
 * ---
 * 
 * $clientid // Returns the id of the bot
 * ```
 */
const $clientid = new FunctionBuilder()
	.setName('$clientid')
	.setBrackets(false)
	.setFields([])
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setCode((data, scopes, thisArg) => {
		const resultString = thisArg.getResultString(
			(discordData) => discordData.client.user?.id,
		);
		const escaped = escapeResult(resultString);
		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $clientid };
