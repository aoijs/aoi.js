const Interpreter = require("../../core/interpreter.js");
module.exports = async (buildDeleteMessage, dchannel, client) => {
    const d = {
        guild: dchannel.guild,
        channel: dchannel,
        client: buildDeleteMessage.client
    };
    let guildChannel;
    for (const cmd of client.cmd?.messageDeleteBulk.V()) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, {}, [], { command: "channelParser", code: cmd.channel }, client.db, true);
            let channel = client.channels.cache.get(id?.code);
            if (!channel) channel = dchannel;
            guildChannel = channel;
        } else {
            guildChannel = cmd.channel;
        }
        await Interpreter(client, d, [], cmd, client.db, false, undefined, { bulk: buildDeleteMessage }, guildChannel);
    }
};
