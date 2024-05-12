const Interpreter = require("../../core/interpreter.js");

module.exports = async (newChannel, client) => {
    const cmds = client.cmd?.channelCreate.V();
    if (!cmds) return;
    const data = { guild: newChannel.guild, channel: newChannel, client: client };

    for (const cmd of cmds) {
        let executionChannel;
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            executionChannel = client.channels.cache.get(id?.code);
        } else {
            executionChannel = client.channels.cache.get(cmd.channel);
        }

        data.channel = executionChannel;

        await Interpreter(client, data, [], cmd, client.db, false, executionChannel?.id, { newChannel }, executionChannel);
    }
};
