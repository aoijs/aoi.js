const Interpreter = require("../../interpreter.js");
module.exports = async (error, client) => {
    const cmds = client.cmd.functionError.allValues();
    let chan;
    const data = {
        guild: error.guild,
        channel: error.channel,
        author: error.author,
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
            {errorData: error},
            chan,
        );
    }
};
