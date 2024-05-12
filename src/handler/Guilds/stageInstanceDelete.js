const Interpreter = require("../../core/interpreter.js");

module.exports = async (stageInstance, client) => {
    const cmds = client.cmd?.stageInstanceDelete.V();
    if (!cmds) return;
    const data = { guild: stageInstance.guild, channel: stageInstance, client: client };
    let guildChannel;
    for (const cmd of cmds) {
        if (cmd?.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd?.channel }, client.db, true);
            guildChannel = client.channels.cache.get(id?.code);
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { oldStageInstace: stageInstance }, guildChannel);
    }
};
