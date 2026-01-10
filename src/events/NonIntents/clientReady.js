const Interpreter = require("../../core/interpreter.js");
const util = require("node:util");
/**
 * @param {import('../../classes/AoiClient.js')} client
 */
module.exports = async (client) => {
    const cmds = ["clientReady", "ready"].flatMap((k) => client.cmd?.[k]?.V() ?? []);

    // TODO: remove when djs v15 releases
    if (client.cmd?.ready?.V()?.length) {
        util.deprecate(() => {}, "The client event 'ready' is deprecated & will be removed in the future. Use 'clientReady' instead.")();
    }

    if (!cmds.length) return;

    let guildChannel;
    const data = {
        client: client
    };
    for (const cmd of cmds) {
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            guildChannel = client.channels.cache.get(id?.code);
            data.channel = guildChannel;
            data.guild = guildChannel?.guild;
        } else {
            guildChannel = client.channels.cache.get(cmd.channel);
            data.channel = guildChannel;
            data.guild = guildChannel?.guild;
        }
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, {}, guildChannel);
    }
};
