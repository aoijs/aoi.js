import { type Message } from 'discord.js';
import type AoiClient from '@aoi.js/classes/AoiClient.js';
import { AoiClientEvents } from '@aoi.js/typings/enum.js';
import { safe } from '@aoi.js/utils/Helpers/core.js';

export async function _messageCreate(message: Message, bot: AoiClient) {
	let prefix: string | undefined;
	if (bot.options.prefix instanceof Array) {
		prefix = bot.options.prefix.find((p) => message.content.startsWith(p));
	} else prefix = bot.options.prefix;

	if (!prefix) return;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const cmd = args.shift()?.toLowerCase();
	if (!cmd) return;

	await bot.managers.commands
		.exec({
			type: 'basic',
			filter: (x) =>
				x.name === cmd || (x.aliases?.includes(cmd) ?? false),
			data: {
				message,
				channel: message.channel,
				guild: message.guild ?? undefined,
				author: message.author,
				client: bot.client,
				args,
				bot,
				member: message.member ?? undefined,
			},
		})
		.catch((err: unknown) => {
			return new Error(err as string);
		});
}

export default function onMessageCreate(bot: AoiClient) {
	bot.client.on('messageCreate', async (message) => {
		const res = await safe(_messageCreate(message, bot));

		if (!res.success) {
			bot.client.emit(
				AoiClientEvents.Error,
				`An error occurred while executing the message event:${res.error as string}`,
			);
		}
	});
}
