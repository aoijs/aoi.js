const Interpreter = require("../../core/interpreter.js");
module.exports = async (dmsg, dchannel, client) => {
    const d = {
        guild: dchannel.guild,
        channel: dchannel,
        client: dmsg.client,
    };
    let chan;
    for (const cmd of client.cmd.messageDeleteBulk.allValues()) {
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
            if (!channel) channel = dchannel;
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
