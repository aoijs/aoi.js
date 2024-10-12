const { MessageReaction, User } = require("discord.js");
const Interpreter = require("../../core/interpreter.js");
/**
 * @param  {MessageReaction} newReaction
 * @param  {User} user
 * @param  {import('../../classes/AoiClient.js')} client
 */
module.exports = async (newReaction, user, burst, client) => {
    const cmds = client.cmd?.reactionAdd.V();
    if (!cmds) return;
    const data = {
        message: newReaction.message,
        channel: newReaction.message.channel,
        client: client,
        guild: newReaction.message.guild,
        author: user
    };
    for (const cmd of cmds) {
        let guildChannel;
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            guildChannel = client.channels?.cache.get(id?.code);
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { reactionData: newReaction }, guildChannel);
    }
};
