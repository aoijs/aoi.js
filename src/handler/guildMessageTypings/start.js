const Interpreter = require("../../interpreter.js");
module.exports = async (typing, client) => {
    const cmds = client.cmd.typingStart.allValues();
    let chan;
    let data = {
        guild: typing.guild,
        client: client,
        author: typing.user,
        channel: typing.channel,
        member: typing.member,
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
            {typing: typing},
            chan,
        );
    }
};
