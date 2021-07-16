module.exports = async d => {
    const inside = d.unpack();
    const fields = inside.splits
    const code = d.command.code
    const err = d.inside(inside)
    const response = fields.every(x=>d.message.guild.channels.cache.get(x))
    
    return {
        code:code.replaceLast(`$serverChannelsExists${inside.total}`, response)
    }
}
