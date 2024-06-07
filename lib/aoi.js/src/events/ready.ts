import { type Camelize, GatewayEventNames, type GatewayReadyData } from 'zeneth';
import { type AoiClient } from '../index.js';

export function onReady(client: AoiClient) {
	client.client.on(GatewayEventNames.Ready, async (data) => {
		await ready(data, client);
	});
}

export async function ready(
	data: Camelize<GatewayReadyData>,
	client: AoiClient,
) {
	await client.managers.commands.exec({
		type: 'ready',
		data: {
			client: client.client,
			bot: client,
			data,
		},
		filter: () => true,
	});
}
