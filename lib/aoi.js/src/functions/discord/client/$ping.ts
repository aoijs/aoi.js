import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the ping of the bot.
 * @example
 * ```aoi
 * ---
 * name: ping
 * type: basic
 * ---
 * 
 * $ping // Returns the ping of the bot
 * ```
 */
const $ping = new FunctionBuilder()
	.setName('$ping')
	.setBrackets(false)
	.setFields([])
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setCode((data, scopes, thisArg) => {
		const resultString = thisArg.getResultString(
			(discordData) => discordData.client.ws.ping,
		);
		const escaped = escapeResult(resultString);
		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $ping };
