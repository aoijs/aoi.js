module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [channelID, messageID] = inside.splits
    
    const channel = d.client.channels.cache.get(channelID)
    
    if (!channel) return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``)
        
    const msg = await channel.messages.fetch(messageID).catch(err => null)

    return {
        code: code.replaceLast(`$messageExists${inside}`, msg ? true : false)
    }
}


