module.exports = async d => {
    const server = d.client.servers.get(d.message.guild.id)

    if(!server) return d.error(`\`songError: Nothing is being played\``)
    var method = false
    if(server.loopQueue === false) {
    server.loopQueue = true
    var method = true
    } else {
        server.loopQueue = false
        var method = false
    }

    return {
        code: d.command.code.replaceLast(`$loopQueue`, method)
    }
}