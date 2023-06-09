import { AoiClient } from "../structures/AoiClient.js";
import { GatewayEventNames, Message, Snowflake } from "aoiluna";
import { isAutoFetchDataEnabled } from "../util/DapiHelper.js";
import { AoiClientEvents } from "../typings/enums.js";
export function onMessage(client: AoiClient) {
    client.client.on(GatewayEventNames.MessageCreate, async (message) => {
        await messageCreate(message, client);
    });
}
export async function messageCreate(message: Message, client: AoiClient) {
    let prefix: string | undefined;
    if (client.options.prefixes instanceof Array)
        prefix = client.options.prefixes.find((p) =>
            message.content.startsWith(p),
        );
    else prefix = client.options.prefixes;
    if (!prefix) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();
    if (!cmd) return;
    const commands = client.managers.commands.basic.filter(
        (x) => x.name === cmd || (x.aliases?.includes(cmd) ?? false),
    );

    if (!commands?.size) return;
    for (const cmd of commands.values()) {
        await cmd
            .__compiled__({
                message,
                channel:
                    client.cache?.channels?.get(message.channelId) ??
                    isAutoFetchDataEnabled("channel", client)
                        ? await client.client.getChannel(message.channelId)
                        : { id: message.channelId, fetched: false },
                guild:
                    client.cache?.guilds?.get(message.guildId) ??
                    isAutoFetchDataEnabled("guild", client)
                        ? await client.client.getGuild(
                              <Snowflake>message.guildId,
                        )
                        : { id: message.guildId, fetched: false },
                author: message.author,
                client: client.client,
                args,
                bot: client,
                member: message.member,
                command: cmd,
            })
            .catch((e) => {
                if (e.component && !e.success) return;
                else client.emit(AoiClientEvents.Error, e);
            });
    }
}
