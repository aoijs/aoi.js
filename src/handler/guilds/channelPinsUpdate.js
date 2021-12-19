const Interpreter = require("../../interpreter.js");
module.exports = async (updatedPinsChannel, time, client) => {
    const cmds = client.cmd.channelPinsUpdate.allValues();
    const data = {
        guild: updatedPinsChannel.guild,
        channel: updatedPinsChannel,
        client: client,
    };
    let chan;
    for (const cmd of cmds) {
        if (cmd?.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                data,
                [],
                {name: "ChannelParser", code: cmd?.channel},
                client.db,
                true,
            );
            chan = client.channels.cache.get(id?.code);
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
            {channel: updatedPinsChannel, time: time},
            chan,
        );
    }
};
