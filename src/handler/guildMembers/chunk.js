const Interpreter = require("../../interpreter.js");
module.exports = async (mem, guild, chunk, client) => {
    let chan;
    const cmds = client.cmd.memberChunk.allValues();
    let data = {guild: guild, channel: undefined, client: client};
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
            {membersChuck: {members: mem, guild: guild, chunk: chunk}},
            chan,
        );
    }
};
