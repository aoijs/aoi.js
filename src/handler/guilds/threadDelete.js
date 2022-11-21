const Interpreter = require("../../interpreter.js");
module.exports = async (thread, client) => {
    const cmds = client.cmd.threadDelete.allValues();
    const data = { guild: thread.guild, channel: thread, client: client };
    let chan;
    for (const cmd of cmds) {
        if (cmd?.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                data,
                [],
                { name: "ChannelParser", code: cmd?.channel },
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
            { oldc: thread },
            chan,
        );
    }
};
