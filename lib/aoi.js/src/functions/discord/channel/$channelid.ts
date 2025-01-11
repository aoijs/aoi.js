import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { ChannelType } from 'discord.js';

<<<<<<< HEAD
/**
 * Returns the id of the channel.
 * @example
 * ```aoi
 * ---
 * name: channelid
 * type: basic
 * ---
 * 
 * $channelid // returns the id of the current channel
 * $channelid[channel name] // returns the id of the channel with the given name
 * ```
 */
const $channelid = new FunctionBuilder()
=======
const $channelId = new FunctionBuilder()
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	.setName('$channelid')
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String | ReturnType.Void)
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'channel name',
			type: ReturnType.String,
			required: true,
			description: 'Name of the channel',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [name] = thisArg.getParams(data);

		if (!name) {
			const result = thisArg.getResultString(
				(discordData) => discordData.channel?.id,
			);

			const escaped = escapeResult(result);

			return {
				code: escaped,
				scope: scopes,
			};
		} 

		const result = thisArg.getResultString(
			// @ts-expect-error:  $0 and $1 are placeholders
			(discordData) => discordData.client.channels.cache.find((channel) => channel.type !== '$0' &&  channel.name === '$1')?.id,
			[ChannelType.DM.toString(), name],
		);

		const escaped = escapeResult(result);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

<<<<<<< HEAD
export { $channelid };
=======
export { $channelId };
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
