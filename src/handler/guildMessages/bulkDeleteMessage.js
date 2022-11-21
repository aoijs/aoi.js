const Interpreter = require("../../interpreter.js");
module.exports = async (dmsg, client) => {
    const d = {
        guild: dmsg.guild,
        channel: dmsg.channel,
        client: dmsg.client,
    };
    let chan;
    for (const cmd of client.cmd.messageDelete.allValues()) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                {},
                [],
                { command: "channelParser", code: cmd.channel },
                client.db,
                true,
            );
            let channel = client.channels.cache.get(id?.code);
            if (!channel) channel = dmsg.first().channel;
            chan = channel;
        } else {
            chan = cmd.channel;
        }
        await Interpreter(
            client,
            d,
            [],
            cmd,
            client.db,
            false,
            undefined,
            { bulk: dmsg },
            chan,
        );
    }
};
