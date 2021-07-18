module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
    
    if (inside.inside) {
        const [channelID, messageID] = inside.splits
        
        const channel = d.message.guild.channels.cache.get(channelID) 
        
        if (!channel) return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``)
        
        const msg = await channel.messages.fetch(messageID).catch(err => null) 
        
        if (!msg) return d.error(`\`${d.func}: Invalid message ID in ${inside}\``)
        
        const m = await msg.unpin().catch(err => null) 
        
        if (!m) return d.error(`\`Failed to unpin message\``)
        
        return {
            code: code.replaceLast(`$unpinMessage${inside}`, "")
        }
    } else {
        const m = await d.message.unpin().catch(err => null) 
        
        if (!m) return d.error(`\`Failed to unpin message\``)
        
        return {
            code: code.replaceLast(`$unpinMessage`, "")
        }
    }
}