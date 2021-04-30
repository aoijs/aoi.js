module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
    
    if (inside.inside) {
        const fields = inside.splits 
        
        const channelID = fields[1] ? fields[0] : d.message.channel.id 
        
        const messageID = fields[1] ? fields[1] : fields[0] 
        
        const channel = d.client.channels.cache.get(channelID) 
        
        if (!channel) return d.error(`❌ Invalid channel ID in \`$messagePublish${inside}\``) 
        
        const msg = await channel.messages.fetch(messageID).catch(err => null) 
        
        if (!msg) return d.error(`Invalid message ID in \`$messagePublish${inside}\``) 
        
        const m = await msg.crosspost().catch(err => null) 
        
        if (!m) return d.error(`❌ Could not publish message `) 
        
        return {
            code: code.replaceLast(`$messagePublish${inside}`, "")
        }
    } else {
        const m = await d.message.crosspost().catch(rr => null) 
        
        if (!m) return d.error(`❌ Could not publish message`) 
        
        return {
            code: code.replaceLast(`$messagePublish`, "")
        }
    }
}