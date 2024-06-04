const Interpreter = require("../../core/interpreter.js");
/**
 * @param {import('../../classes/AoiClient.js')} client
 * @param {import('discord.js').ApplicationCommandData} oldApplicationCommandData
 * @param {import('discord.js').ApplicationCommandData} newApplicationCommandData
 */
module.exports = async (oldApplicationCommandData, newApplicationCommandData, client) => {
    const cmds = client.cmd?.applicationCmdUpdate.V();
    if (!cmds) return;
    let guildChannel;
    const data = {
        guild: newApplicationCommandData.guild,
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
        await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, { newApplicationCommandData, oldApplicationCommandData }, guildChannel);
    }
};
