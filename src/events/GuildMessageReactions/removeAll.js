const Interpreter = require("../../core/interpreter.js");
const { Message } = require("discord.js");
/**
 * @param  {Message} reactionMessage
 * @param  {import('../../classes/AoiClient.js')} client
 */
module.exports = async (reactionMessage, burst, client) => {
    const cmds = client.cmd?.reactionRemoveAll.V();
    if (!cmds) return;
    const data = {
        client: client,
        guild: reactionMessage.guild,
        author: reactionMessage.author,
        channel: reactionMessage.channel,
        member: reactionMessage.member
    };
    for (const cmd of cmds) {
        let guildChannel;
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            guildChannel = client.channels?.cache.get(id?.code);
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, {}, guildChannel);
    }
};
