const Interpreter = require("../../core/interpreter.js");
/**
 * @param {import('../../classes/AoiClient.js')} client
 * @param {import('discord.js').User} oldUser
 * @param {import('discord.js').User} newUser
 */
module.exports = async (oldUser, newUser, client) => {
    const cmds = client.cmd?.userUpdate.V();
    if (!cmds) return;
    let guildChannel;
    const data = {
        author: newUser,
        client: client
    };
    for (const cmd of cmds) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            guildChannel = client.channels.cache.get(id?.code);
            data.channel = guildChannel;
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
            data.channel = guildChannel;
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { oldUser, newUser }, guildChannel);
    }
};
