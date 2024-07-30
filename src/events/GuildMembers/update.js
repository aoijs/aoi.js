const Interpreter = require("../../core/interpreter.js");

module.exports = async (oldMember, newMember, client) => {
    const cmds = client.cmd?.memberUpdate.V();
    if (!cmds) return;
    let data = {
        guild: oldMember?.guild || newMember?.guild,
        author: oldMember?.user || newMember?.user,
        member: oldMember?.member || newMember,
        client: client
    };
    for (const cmd of cmds) {
        let executionChannel;
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            executionChannel = client.channels.cache.get(id?.code);
        } else {
            executionChannel = client.channels.cache.get(cmd.channel);
        }

        data.channel = executionChannel;

        await Interpreter(client, data, [], cmd, client.db, false, executionChannel?.id, { newMember, oldMember }, executionChannel);
    }
};
