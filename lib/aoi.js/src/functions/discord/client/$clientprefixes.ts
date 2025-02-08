import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the prefixes of the bot.
 * @example
 * ```aoi
 * ---
 * name: clientprefixes
 * type: basic
 * ---
 * 
 * $clientprefixes // Returns the prefixes of the bot
 * ```
 */
const $clientprefixes = new FunctionBuilder()
	.setName('$clientprefixes')
	.setBrackets(false)
	.setFields([])
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setCode((data, scopes, thisArg) => {
		const resultString = thisArg.getResultString(
			(discordData) => discordData.bot.prefix.toString(),
		);
		const escaped = escapeResult(resultString);
		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $clientprefixes };
