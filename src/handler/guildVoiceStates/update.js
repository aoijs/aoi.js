const Interpreter = require("../../interpreter.js");
module.exports = async (os, ns, client) => {
    const cmds = client.cmd.voiceStateUpdate.allValues();
    for (const cmd of cmds) {
        let chan;
        const data = {
            guild: os.guild,
            client: client,
            author: ns.member.user,
            member: ns.member,
        };
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(
                client,
                data,
                [],
                { name: "ChannelParser", code: cmd.channel },
                client.db,
                true,
            );
            const channel = client.channels.cache.get(id?.code);
            chan = channel ?? undefined;
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
            chan?.id || "",
            { oldVoiceState: os, newVoiceState: ns },
            chan || undefined,
        );
    }
};
