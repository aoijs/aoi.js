const Interpreter = require("../interpreter.js");
module.exports = async (shardID, client, cmds) => {
    for (const cmd of cmds.shardReconnecting.array()) {
        const id = cmd?.channel?.includes("$")
            ? (
                await Interpreter(
                    client,
                    {},
                    [],
                    {
                        name: "channelParser",
                        code: cmd.channel,
                    },
                    client.db,
                    true,
                )
            )?.code
            : cmd.channel;
        const channel = client.channels.cache.get(id);
        if (!channel) return;

        await Interpreter(
            client,
            {},
            [],
            cmd,
            client.db,
            false,
            undefined,
            {
                shardID: shardID,
            },
            channel,
        );
    }
};
