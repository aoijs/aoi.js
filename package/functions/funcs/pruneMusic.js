const queue = require("../../functions/funcs/queue")

module.exports = async d => {
    const server = d.client.servers.get(d.message.guild.id)

    if(!server) return d.error(`:x: Nothing is being played!`)
    const method = !server.pruneEnabled
    server.pruneEnabled = method

    return {
        code: d.command.code.replaceLast(`$pruneMusic`, method)
    }
}