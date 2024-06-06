const Interpreter = require("../../core/interpreter.js");
const { TextChannel, NewsChannel } = require("discord.js");

/**
 * @param oldVoiceState Old voice state event data
 * @param newVoiceState New voice state event data
 * @param {TextChannel | NewsChannel } channelData
 * @param {import('../../classes/AoiClient.js')} client
 */
module.exports = async (oldVoiceState, newVoiceState, channelData, client) => {
    const cmds = client.cmd?.webhooksUpdate.V();
    if (!cmds) return;
    for (const cmd of cmds) {
        let guildChannel;
        const data = {
            guild: channelData.guild,
            client: client,
            channel: channelData
        };
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            const channel = client.channels.cache.get(id?.code);
            guildChannel = channel ?? undefined;
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id || "", { oldVoiceState, newVoiceState }, guildChannel);
    }
};
