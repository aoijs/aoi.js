const Interpreter = require("../../core/interpreter.js");
module.exports = async (olddata, newdata, client) => {
    let guildChannel;
    const d = {
        client: client,
        guild: newdata.guild,
        channel: newdata.channel,
        message: newdata.message,
        author: newdata.author
    };
    const cmds = client.cmd?.variableDelete.V();
    if (!cmds) return;
    for (const cmd of cmds) {
        const id = cmd.channel?.includes("$") ? (await Interpreter(client, d, [], { name: "ChannelParser", code: cmd.channel }, client.db, true))?.code : cmd.channel;

        guildChannel = client.channels.cache.get(id);

        await Interpreter(client, d, [], cmd, client.db, false, guildChannel?.id, { newVariable: newdata, oldVarible: olddata }, guildChannel);
    }
};
