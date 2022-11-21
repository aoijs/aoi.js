const { MessageReaction, User } = require("discord.js");
const Interpreter = require("../../interpreter.js");
/**
 * @param  {MessageReaction} reaction
 * @param  {User} user
 * @param  {import('../../classes/Bot.js')} client
 */
module.exports = async (reaction, user, client) => {
    const cmds = client.cmd.reactionAdd.allValues();
    const data = {
        message: reaction.message,
        channel: reaction.message.channel,
        client: client,
        guild: reaction.message.guild,
        author: user,
    };
    for (const cmd of cmds) {
        let chan;
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                data,
                [],
                { name: "ChannelParser", code: cmd.channel },
                client.db,
                true,
            );
            chan = client.channels?.cache.get(id?.code);
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
            chan?.id,
            { reactionData: reaction },
            chan,
        );
    }
};
