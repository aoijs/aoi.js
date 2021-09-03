module.exports = async d => {
    const code = d.command.code

    const server = d.client.servers.get(d.message.guild.id)

    if(!server) return d.error(`:x: Nothing is being played!`)

    server.connection.dispatcher.pause(true)

    d.client.servers.set(d.message.guild.id, server)

    return {
        code: d.command.code.replaceLast(`$pauseSong`, "")
    }
}