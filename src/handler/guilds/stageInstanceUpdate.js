const Interpreter = require("../../interpreter.js");
module.exports = async (oldstageint, newstageint, client) => {
    const cmds = client.cmd.stageInstanceUpdate.allValues();
    const data = {
        guild: newstageint.guild,
        channel: newstageint.channel,
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
            { oldStageInstance: oldstageint, newStageInstance: newstageint },
            chan,
        );
    }
};
