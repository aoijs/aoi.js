const Interpreter = require("../../interpreter.js");
module.exports = async (ou, nu, client) => {
    const cmds = client.cmd.userUpdate.allValues();
    let chan;
    const data = {
        author: nu,
        client: client,
    };
    for (const cmd of cmds) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                data,
                [],
                {name: "ChannelParser", code: cmd.channel},
                client.db,
                true,
            );
            chan = client.channels.cache.get(id?.code);
            data.channel = chan;
        } else {
            chan = client.channels.cache.get(cmd.channel);
            data.channel = chan;
        }
        await Interpreter(
            client,
            data,
            [],
            cmd,
            client.db,
            false,
            chan?.id,
            {olduser: ou, newuser: nu},
            chan,
        );
    }
};
