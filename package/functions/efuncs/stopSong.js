const queue = require("../../functions/funcs/queue")

module.exports = async d => {
    const server = d.client.servers.get(d.message.guild.id)

    if(!server || !server.connection.dispatcher) return d.error(`:x: Nothing is being played!`)

    server.state = "STOPPED"
    server.connection.dispatcher.end()

    return {
        code: d.command.code.replaceLast(`$stopSong`, "")
    }
}