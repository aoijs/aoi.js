const Interpreter = require("../../core/interpreter.js");
/**
 * @param {import('../../classes/AoiClient.js')} client
 * @param {import('discord.js').GatewayEntitlementDeleteDispatchData} entitlementData
 */
module.exports = async (entitlementData, client) => {
    const cmds = client.cmd?.entitlementDelete.V();
    if (!cmds) return;
    let guildChannel;

    const data = {
        client: client
    };

    for (const cmd of cmds) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            guildChannel = client.channels.cache.get(id?.code);
            data.channel = guildChannel;
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
            data.channel = guildChannel;
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { oldEntitlementData: entitlementData }, guildChannel);
    }
};
