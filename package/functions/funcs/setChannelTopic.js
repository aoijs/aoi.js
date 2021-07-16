module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [channelID, topic = ""] = inside.splits
    
    const channel = d.message.guild.channels.cache. get(channelID) 
    
    if (!channel) return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``)
    
    const ch = await channel.edit({
        topic: topic.addBrackets()
    }).catch(err => null) 
    
    if (!ch) return d.error(`\`Failed to edit channel topic\``)
    
    return {
        code: code.replaceLast(`$setChannelTopic${inside}`, "")
    }
} 