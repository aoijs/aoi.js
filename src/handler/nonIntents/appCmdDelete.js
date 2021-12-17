const Interpreter = require("../../interpreter.js");
module.exports = async (app, client) => {
    const cmds = client.cmd.applicationCmdDelete.allValues();
    let chan;
    const data = {
        guild: app.guild,
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
            {oldapp: app},
            chan,
        );
    }
};
