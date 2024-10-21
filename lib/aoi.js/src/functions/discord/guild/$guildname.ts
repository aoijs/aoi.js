import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

const $guildName = new FunctionBuilder()
	.setName('$guildid')
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'guild id',
			type: ReturnType.String,
			required: true,
			description: 'id of the guild',
		},
	])
	.setReturns(ReturnType.String)
	.setType(FunctionType.Getter)
	.setCode((data, scopes, thisArg) => {
		const [id] = thisArg.getParams(data);

		let resultString: string; 
		if ( id ) {
			resultString = thisArg.getResultString(
				(discordData) => discordData.client.guilds.cache.find( guild => guild.id === '$0')?.name,
				[id],
			);
		} else {
			resultString = thisArg.getResultString(
				(discordData) => discordData.guild?.name,
			);
		}

		const escaped = escapeResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $guildName };
