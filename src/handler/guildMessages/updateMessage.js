const Interpreter = require("../../interpreter.js");
module.exports = async (oldm, newm, client) => {
    let chan;
    for (const cmd of client.cmd.messageUpdate.allValues()) {
        const id = cmd.channel.includes("$")
            ? (
                await Interpreter(
                    client,
                    newm,
                    [],
                    {name: "channelParser", code: cmd.channel},
                    client.db,
                    true,
                )
            )?.code
            : cmd.channel;

        let channel = client.channels.cache.get(id);
        if (!channel) channel = newm.channel;
        chan = channel;
        await Interpreter(
            client,
            newm,
            newm?.content?.split(" "),
            cmd,
            client.db,
            false,
            chan?.id,
            {oldm: oldm},
            chan,
        );
    }
};
