const Interpreter = require("../../core/interpreter.js");
module.exports = async (oldSticker, client) => {
    const cmds = client.cmd?.stickerDelete.V();
    if (!cmds) return;
    const data = { guild: oldSticker.guild, client: client };
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
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { oldSticker }, guildChannel);
    }
};
