import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Returns the banner color of the author.
 * @example
 * ```aoi
 * ---
 * name: authorbannercolor
 * type: basic
 * ---
 *
 * $authorbannercolor // returns the banner color of the author
 * ```
 */
const $authorbannercolor = new FunctionBuilder()
	.setName('$authorbannercolor')
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String | ReturnType.Void)
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'default',
			type: ReturnType.String,
			required: false,
			description: 'Size of the banner',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [def = 'default'] = thisArg.getParams(data);

		const result = thisArg.getResultString(
			async (discordData) =>
				(await (async () => {
					await discordData.author?.fetch();
					return discordData.author?.hexAccentColor;
				})()) ?? '$0',
			[parseString(def)],
		);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $authorbannercolor };
