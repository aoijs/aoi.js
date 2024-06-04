const Interpreter = require("../../core/interpreter.js");
module.exports = async (data, client) => {
    let guildChannel;
    const d = {
        client: client,
        guild: data.guild,
        channel: data.channel,
        message: data.message,
        author: data.author
    };
    const cmds = client.cmd?.variableCreate.V();
    if (!cmds) return;
    for (const cmd of cmds) {
        const id = cmd.channel?.includes("$") ? (await Interpreter(client, d, [], { name: "ChannelParser", code: cmd.channel }, client.db, true))?.code : cmd.channel;

        guildChannel = client.channels.cache.get(id);

        await Interpreter(client, d, [], cmd, client.db, false, guildChannel?.id, { oldVariable: data }, guildChannel);
    }
};
