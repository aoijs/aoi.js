import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum';
import { escapeResult } from '@aoi.js/utils/Helpers/core';

const $guildId = new FunctionBuilder()
	.setName('$guildid')
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'guild name',
			type: ReturnType.String,
			required: true,
			description: 'Name of the guild',
		},
	])
	.setReturns(ReturnType.String)
	.setType(FunctionType.Getter)
	.setCode((data, scopes, thisArg) => {
		const [name] = thisArg.getParams(data);

		let resultString: string; 
		if ( name ) {
			resultString = thisArg.getResultString(
				(discordData) => discordData.client.guilds.cache.find( guild => guild.name === '$0')?.id,
				[name],
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

export { $guildId };
