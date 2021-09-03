module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const [channelID, messageID] = inside.splits
    
    const channel = d.client.channels.cache.get(channelID)
    
    if (!channel) return d.error(`❌ Invalid channel ID in \`$hasEmbeds${inside}\``)
        
    const msg = await channel.messages.fetch(messageID).catch(err => null)
        
    if (!msg) return d.error(`❌ Invalid message ID in \`$hasEmbeds${inside}\``)
         
    return {
        code: code.replaceLast(`$hasEmbeds${inside}`, msg.embeds[0] ? true : false)
    }
}


 