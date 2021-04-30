module.exports = async d => {
    const server = d.client.servers.get(d.message.guild.id)

    if(!server || !server.connection.dispatcher) return d.error(`:x: Nothing is being played!`)

    server.connection.dispatcher.end()
    server.songs.playing = true

    d.client.servers.set(d.message.guild.id, server)
    
    return {
        code: d.command.code.replaceLast(`$skipSong`, "")
    }
}