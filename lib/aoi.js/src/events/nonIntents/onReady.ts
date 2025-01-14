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
		const res = await safe(_ready(bot));

		if (!res.success) {
			bot.client.emit(AoiClientEvents.Error, 'An error occurred while executing the ready event');
		}
	});
}
