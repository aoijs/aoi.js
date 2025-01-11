import type AoiClient from '@aoi.js/classes/AoiClient.js';
import { AoiClientEvents } from '@aoi.js/typings/enum.js';
import { safe } from '@aoi.js/utils/Helpers/core.js';

export async function _ready(bot: AoiClient) {
	await bot.managers.commands.exec({
		type: 'ready',
		data: {
			bot: bot,
			client: bot.client,
		},
		filter: () => true,
	});
}

export default function onReady(bot: AoiClient) {
	bot.client.on('ready', async () => {
<<<<<<< HEAD
		const res = await safe(_ready(bot));

		if (!res.success) {
=======
		const [error] = await safe(_ready(bot));

		if (error) {
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
			bot.client.emit(AoiClientEvents.Error, 'An error occurred while executing the ready event');
		}
	});
}
