const Interpreter = require("../../interpreter.js");
module.exports = async (oldc, newc, client) => {
    const cmds = client.cmd.channelUpdate.allValues();
    const data = {guild: newc.guild, channel: newc, client: client};
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
            {oldc: oldc, newc: newc},
            chan,
        );
    }
};
