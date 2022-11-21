const Interpreter = require("../../interpreter.js");
const { Message } = require("discord.js");
/**
 * @param  {Message} reactionMessage
 * @param  {import('../../classes/Bot.js')} client
 */
module.exports = async (reactionMessage, client) => {
    const cmds = client.cmd.reactionRemoveAll.allValues();
    const data = {
        client: client,
        guild: reactionMessage.guild,
        author: reactionMessage.author,
        channel: reactionMessage.channel,
        member: reactionMessage.member,
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
            {},
            chan,
        );
    }
};
