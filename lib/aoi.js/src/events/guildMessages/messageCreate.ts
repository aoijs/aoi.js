import { type Message } from 'discord.js';
import type AoiClient from '@aoi.js/classes/AoiClient.js';
import { AoiClientEvents } from '@aoi.js/typings/enum.js';
import { safe } from '@aoi.js/utils/Helpers/core.js';

export async function _messageCreate(message: Message, bot: AoiClient) {
	let prefix: string | undefined;
	if (bot.options.prefix instanceof Array) {
<<<<<<< HEAD
		prefix = bot.options.prefix.find((p) => message.content.startsWith(p));
	} else prefix = bot.options.prefix;
=======
		prefix = bot.options.prefix.find((p) =>
			message.content.startsWith(p),
		);
	} else prefix = bot.options.prefix;
	
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb

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
<<<<<<< HEAD
		.catch((err: unknown) => {
			return new Error(err as string);
=======

		.catch((e) => {
			if (e.component && !e.success) return;
			else bot.client.emit(AoiClientEvents.Error, e);
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		});
}

export default function onMessageCreate(bot: AoiClient) {
	bot.client.on('messageCreate', async (message) => {
<<<<<<< HEAD
		const res = await safe(_messageCreate(message, bot));

		if (!res.success) {
			bot.client.emit(
				AoiClientEvents.Error,
				`An error occurred while executing the message event:${res.error as string}`,
			);
=======
		const [error] = await safe(_messageCreate(message, bot));

		if (error) {
			bot.client.emit(AoiClientEvents.Error, 'An error occurred while executing the message event');
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		}
	});
}
