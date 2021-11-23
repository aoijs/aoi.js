module.exports = async (track, server, voice, client) => {
    //console.log(track)
    const cmds = voice.cmd.musicStart.allValues()
    let chan;
    let data = {
        guild: server.channel.guild,
        channel: server.textChannel
    }
    for (const cmd of cmds) {
        const id = cmd.channel.includes("$") ? await client.functionManager.interpreter(client, data, [], {
            name: "ChannelParser",
            code: cmd.channel,
            functions: client.functionManager.findFunctions(cmd.channel)
        }, client.db, true) : {code: cmd.channel}
        chan = client.channels.cache.get(id?.code)
        await client.functionManager.interpreter(client, data, [], cmd, client.db, false, chan?.id, {track: track}, chan)
    }
}