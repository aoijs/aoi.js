module.exports = async d => {
    const code = d.command.code 
    
    const r = code.split("$getChannelSlowmode").length - 1 
    
    const after = code.split("$getChannelSlowmode")[r].after()
    
    if (after.inside) {
        const inside = after.inside
        
        const channel = d.client.channels.cache.get(inside) 
        
        if (!channel) return d.error(`❌ Invalid channel ID in \`$getChannelSlowmode${after}\``) 
        
        return {
            code: code.replaceLast(`$getChannelSlowmode${after}`, channel.rateLimitPerUser || 0)
        }
    } else {
        return {
            code: code.replaceLast(`$getChannelSlowmode`, d.message.channel.rateLimitPerUser || 0)
        }
    }
}