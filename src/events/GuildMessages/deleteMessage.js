const Interpreter = require("../../core/interpreter.js");
module.exports = async (deletedMessage, client) => {
    const data = Object.assign({}, deletedMessage);
    data.channel = deletedMessage.channel;
    data.guild = deletedMessage.guild;
    data.content = deletedMessage.content;
    let guildChannel;

    if (!data.partial && client.user.id === data?.author?.id) return;
    for (const cmd of client.cmd?.messageDelete.V()) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { command: "channelParser", code: cmd.channel }, client.db, true);
            let channel = client.channels.cache.get(id?.code);
            if (!channel) channel = deletedMessage.channel;
            guildChannel = channel;
        } else {
            data.channel = client.channels.cache.get(cmd.channel) || deletedMessage.channel;
        }
        if (!data.guild) data.guild = deletedMessage.guild || deletedMessage.channel?.guild;
        await Interpreter(client, data, data?.content?.split(" ") || [], cmd, client.db, false, deletedMessage.channel?.id, { oldMessage: deletedMessage }, guildChannel);
    }
};
