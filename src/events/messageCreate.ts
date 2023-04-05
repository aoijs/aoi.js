import { AoiClient } from "../structures/AoiClient.js";
import { GatewayEventNames, Message } from "aoiluna";
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
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();
    if (!cmd) return;
    const commands = client.cmds.basicCommand.filter(
        (x) => x.name === cmd || (x.aliases?.includes(cmd) ?? false),
    );

    if (!commands?.size) return;
    for (const cmd of commands.values()) {
        await cmd.__compiled__({
            message,
            channel:
                client.cache?.channels?.get(message.channelId) ??
                (await client.client.getChannel(message.channelId)),
            guild:
                client.cache?.guilds?.get(message.guildId) ??
                (await client.client.getGuild(<bigint>message.guildId)),
            author: message.author,
            client: client.client,
            args,
            bot: client,
            member: message.member,
            command: cmd,
        });
    }
}
