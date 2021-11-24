const Interpreter = require("../interpreter.js");

module.exports = async (event, client, commands, ...data) => {
    let msg = {
        channel: undefined,
        author: undefined,
        content: "",
        guild: undefined,
        member: undefined,
    };
    let EventData = {};
    const cmds = commands.allValues();
    for (const cmd of cmds) {
        if (cmd.channel) {
            const id = cmd.channel.includes("$")
                ? (
                    await Interpreter(
                        client,
                        {author: undefined, channel: undefined, message: undefined},
                        [],
                        {name: "channelParser", code: cmd.channel},
                        client.db,
                        true,
                    )
                )?.code
                : cmd.channel;
            const channel = client.channels.cache.get(id);
            if (!channel) return console.error("Channel doesn't exist");

            msg = {
                channel: channel,
                author: undefined,
                content: "",
                guild: channel.guild,
                member: undefined,
            };
        }
        EventData = data;
        await Interpreter(client, msg, [], cmd, undefined, false, cmd.channel, {
            eventData: EventData,
        });
    }
};
