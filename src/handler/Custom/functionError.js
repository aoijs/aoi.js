const Interpreter = require("../../core/interpreter.js");
module.exports = async (error, client) => {
    const cmds = client.cmd?.functionError.V();
    if (!cmds) return;
    let guildChannel;
    const data = {
        guild: error.guild,
        channel: error.channel,
        author: error.author,
        client: client
    };
    for (const cmd of cmds) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            guildChannel = client.channels.cache.get(id?.code);
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { errorData: error }, guildChannel);
    }
};
