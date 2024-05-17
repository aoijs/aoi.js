const Interpreter = require("../../core/interpreter.js");

module.exports = async (pollData, authorId, client) => {
    const cmds = client.cmd?.pollVoteAdd.V();
    if (!cmds) return;
    const data = { guild: pollData.guild, author: client.users.cache.get(authorId), client: client };
    let guildChannel;
    for (const cmd of cmds) {
        if (cmd?.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd?.channel }, client.db, true);
            guildChannel = client.channels.cache.get(id?.code);
            data.channel = guildChannel;
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
            data.channel = guildChannel;
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { pollData }, guildChannel);
    }
};
