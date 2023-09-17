const { TextChannel, NewsChannel } = require("discord.js");
const Interpreter = require("../../core/interpreter.js");
/**
 * @param os
 * @param ns
 * @param  {TextChannel | NewsChannel } channelData
 * @param  {import('../../classes/AoiClient.js')} client
 */
module.exports = async (os, ns, channelData, client) => {
    const cmds = client.cmd.webhooksUpdate.allValues();
    for (const cmd of cmds) {
        let chan;
        const data = {
            guild: channelData.guild,
            client: client,
            channel: channelData,
        };
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                data,
                [],
                { name: "ChannelParser", code: cmd.channel },
                client.db,
                true,
            );
            const channel = client.channels.cache.get(id?.code);
            chan = channel ?? undefined;
        } else {
            chan = client.channels.cache.get(cmd.channel);
        }
        await Interpreter(
            client,
            data,
            [],
            cmd,
            client.db,
            false,
            chan?.id || "",
            { oldVoiceState: os, newVoiceState: ns },
            chan || undefined,
        );
    }
};
