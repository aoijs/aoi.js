const Interpreter = require("../../core/interpreter.js");
/**
 * @param  {import('../../classes/AoiClient.js')} client
 */
module.exports = async (client) => {
    const cmds = client.cmd?.loop.V();
    if (!cmds) return;
    let guildChannel;
    let Data = {
        client: client,
        channel: undefined,
        guild: undefined
    };
    for (const cmd of cmds) {
        const data = { ...Data };
        if (cmd.channel?.includes("$")) {
            const id = await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true);
            guildChannel = await client.channels.fetch(id?.code);
            data.channel = guildChannel;
            data.guild = guildChannel?.guild;
        } else {
            guildChannel = await client.channels.fetch(cmd.channel);
            data.channel = guildChannel;
            data.guild = guildChannel?.guild;
        }
        setInterval(async () => {
            await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, {}, guildChannel);
        }, cmd.every || 60000);

        if (cmd.executeOnStartup) await Interpreter(client, data, [], cmd, client.db, false, guildChannel?.id, {}, guildChannel);
    }
};
