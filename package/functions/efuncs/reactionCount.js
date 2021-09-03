module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [channelID, messageID, emoji] = inside.splits
    
    const channel = d.client.channels.cache.get(channelID) 
    
    if (!channel) return d.error(`❌ Invalid channel ID in \`$reactionCount${inside}\``) 
    
    const msg = await channel.messages.fetch(messageID).catch(err => null) 
    
    if (!msg) return d.error(`❌ Invalid message ID in \`$reactionCount${inside}\``) 
    
    const reaction = msg.reactions.cache.get(emoji.addBrackets().includes("<") ? emoji.addBrackets().split(":")[2].split(">")[0] : emoji)
    
    return {
        code: code.replaceLast(`$reactionCount${inside}`, reaction ? reaction.count : 0)
    }
}