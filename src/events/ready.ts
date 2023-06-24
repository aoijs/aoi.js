import { Camelize, GatewayEventNames, GatewayReadyData } from "zeneth";
import { AoiClient } from "../index.js";

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
        type: "ready",
        data: {
            client: client.client,
            bot: client,
            data,
        },
        filter: () => true,
    });
}
