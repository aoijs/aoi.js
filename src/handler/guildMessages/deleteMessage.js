const Interpreter = require("../../interpreter.js");
module.exports = async (dmsg, client) => {
    const data = Object.assign({}, dmsg);
    data.channel = dmsg.channel;
    data.guild = dmsg.guild;
    data.content = dmsg.content;
    let chan;

    if (!data.partial && client.user.id === data?.author?.id) return;
    for (const cmd of client.cmd.messageDelete.allValues()) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                data,
                [],
                {command: "channelParser", code: cmd.channel},
                client.db,
                true,
            );
            let channel = client.channels.cache.get(id?.code);
            if (!channel) channel = dmsg.channel;
            chan = channel;
        } else {
            data.channel = client.channels.cache.get(cmd.channel) || dmsg.channel;
        }
        if (!data.guild) data.guild = dmsg.guild || dmsg.channel?.guild;
        await Interpreter(
            client,
            data,
            data?.content?.split(" ") || [],
            cmd,
            client.db,
            false,
            dmsg.channel?.id,
            {oldm: dmsg},
            chan,
        );
    }
};
