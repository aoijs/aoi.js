const Interpreter = require("../../interpreter.js");
module.exports = async (oldm, newm, client) => {
    const cmds = client.cmd.threadMemberUpdate.allValues();
    const data = {
        guild: oldm.thread?.guild || newm.thread?.guild,
        channel: oldm.thread || newm.thread,
        client: client,
    };
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
            { oldm: oldm, newm: newm },
            chan,
        );
    }
};
