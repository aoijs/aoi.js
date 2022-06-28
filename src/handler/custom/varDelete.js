const Interpreter = require("../../interpreter.js");
module.exports = async (data, client) => {
    let chan;
    const d = {
        client: client,
        guild: data.guild,
        channel: data.channel,
        message: data.message,
        author: data.author,
    };
    const cmds = client.cmd.variableDelete.allValues();
    for (const cmd of cmds) {
        const id = cmd.channel?.includes("$")
            ? (
                await Interpreter(
                    client,
                    d,
                    [],
                    {name: "ChannelParser", code: cmd.channel},
                    client.db,
                    true,
                )
            )?.code
            : cmd.channel;

        chan = client.channels.cache.get(id);

        await Interpreter(
            client,
            d,
            [],
            cmd,
            client.db,
            false,
            chan?.id,
            {newv: data},
            chan,
        );
    }
};
