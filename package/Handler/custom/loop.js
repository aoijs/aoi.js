const Interpreter = require('../../interpreter.js')
module.exports = async (client) => {
    const cmds = client.cmd.loop.allValues()
    let chan;
    let data = {
        client: client,
        channel,
        guild,
    }
    for (const cmd of cmds) {
        if (cmd.channel?.includes("$")) {
            const id = (await Interpreter(client, data, [], { name: "ChannelParser", code: cmd.channel }, client.db, true));
            chan = client.channels.cache.get(id)
            data.channel = chan
            data.guild = chan?.guild
        }
        setInterval(() => {
            await Interpreter(client, data, [], cmd, client.db, false, chan?.id, {}, chan);
        }, cmd.every || 60000);

        if (cmd.executeOnStartup) await Interpreter(client, data, [], cmd, client.db, false, chan?.id, {}, chan);
    }
}