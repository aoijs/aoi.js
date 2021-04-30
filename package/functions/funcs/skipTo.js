const embed = require("../../handlers/errors.js")
module.exports = async d => {
    const code = d.command.code
    const server = d.client.servers.get(d.message.guild.id)

    if(!server || !server.connection.dispatcher) return d.error(`:x: Nothing is being played!`)

    var songs = server.songs
    
    const inside = d.unpack()
    
        if (inside.inside) {
            if(isNaN(inside)) return embed(d, ":x: Argument is not a number in $skipTo"+inside+"")
if(inside < 2) { server.connection.dispatcher.end()
return {
code: d.command.code.replaceLast(`$skipTo${inside}`, "")
}
}

if (server.songs[0] && server.songs[0].message && server.songs[0].message.delete) server.songs[0].message.delete().catch(err => { })

delete server.songs[0].info
delete server.songs[0].media

const spliced = server.songs.splice(0, Math.floor(inside.inside - 1))

server.connection.dispatcher.end()

if (server.loopQueue == true) server.songs.push(...spliced)
            
            d.client.servers.set(d.message.guild.id, server)
    
            return {code: d.command.code.replaceLast(`$skipTo${inside}`, "")}
        } else {
            return embed(d, ":x: Command name $skipTo is invalid")
        }
    
}
