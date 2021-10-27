module.exports = async d => {
    const server = d.client.servers.get(d.message.guild.id)

    if(!server || !server.connection.dispatcher) return d.error(`\`songError: Nothing is being played\``)
    
    const inside = d.unpack()
    const n = new Number(inside.inside || 0)
        if (inside.inside) {
            if(isNaN(n)) return d.error(`\`${d.func}: Argument is not a number in ${inside.inside}\``)
        if(n < 2) { server.connection.dispatcher.end()
    return {
            code: d.command.code.replaceLast(`$skipTo${inside.total ? inside.total : ""}`, "")
        }
    }

delete server.songs[0].info
delete server.songs[0].media

const spliced = server.songs.splice(0, Math.floor(inside.inside - 1))

server.connection.dispatcher.end()

if (server.loopQueue == true) server.songs.push(...spliced)
            
            d.client.servers.set(d.message.guild.id, server)
    
            return {code: d.command.code.replaceLast(`$skipTo${inside.total ? inside.total : ""}`, "")}
        } else {
            return d.error(`\`${d.func} command is invalid\``)
        }
}
