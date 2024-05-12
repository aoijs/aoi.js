const Interpreter = require("../../core/interpreter.js");
module.exports = async (oldPresence, newPresence, client) => {
    const cmds = client.cmd?.presenceUpdate.V();
    if (!cmds) return;
    for (const cmd of cmds) {
        let guildChannel;
        const data = {
            guild: newPresence.guild,
            client: client,
            author: newPresence.user,
            member: newPresence.member
        };
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            const channel = client.channels.cache.get(id?.code);
            guildChannel = channel ?? undefined;
            data.channel = guildChannel;
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
            data.channel = guildChannel;
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { oldPresence, newPresence }, guildChannel);
    }
};
