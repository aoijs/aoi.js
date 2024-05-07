const Interpreter = require("../../core/interpreter.js");

module.exports = async (oldStageInstance, newStageInstance, client) => {
    const cmds = client.cmd?.stageInstanceUpdate.V();
    if (!cmds) return;
    const data = {
        guild: newStageInstance.guild,
        channel: newStageInstance.channel,
        client: client
    };
    let guildChannel;
    for (const cmd of cmds) {
        if (cmd?.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd?.channel }, client.db, true);
            guildChannel = client.channels.cache.get(id?.code);
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { oldStageInstance: oldStageInstance, newStageInstance: newStageInstance }, guildChannel);
    }
};
