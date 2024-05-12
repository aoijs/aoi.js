const Interpreter = require("../../core/interpreter.js");
const { TextChannel, NewsChannel } = require("discord.js");

/**
 * @param oldVoiceState Old voice state event data
 * @param newVoiceState New voice state event data
 * @param {TextChannel | NewsChannel } channelData
 * @param {import('../../classes/AoiClient.js')} client
 */
module.exports = async (oldVoiceState, newVoiceState, client) => {
    const cmds = client.cmd?.voiceStateUpdate.V();
    if (!cmds) return;
    for (const cmd of cmds) {
        let guildChannel;
        const data = {
            guild: oldVoiceState.guild,
            client: client,
            author: newVoiceState.member.user,
            member: newVoiceState.member
        };
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            const channel = client.channels.cache.get(id?.code);
            guildChannel = channel ?? undefined;
            data.channel = guildChannel;
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
            data.channel = guildChannel;
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id || "", { oldVoiceState: oldVoiceState, newVoiceState: newVoiceState }, guildChannel);
    }
};
