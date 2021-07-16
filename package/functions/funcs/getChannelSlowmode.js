module.exports = async d => {
    const code = d.command.code 
    
    const r = code.split("$getChannelSlowmode").length - 1 
    
    const after = code.split("$getChannelSlowmode")[r].after()

    if (after.inside) {
        const err = d.inside(inside);

        if (err) return d.error(err);
        
        const channel = d.client.channels.cache.get(inside) 
        
        if (!channel) return d.error(`\`${d.func}: Invalid channel ID in ${after}\``)
        
        return {
            code: code.replaceLast(`$getChannelSlowmode${after}`, channel.rateLimitPerUser || 0)
        }
    } else {
        return {
            code: code.replaceLast(`$getChannelSlowmode`, d.message.channel.rateLimitPerUser || 0)
        }
    }
}