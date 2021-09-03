module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [channelID, options = "username", separator = ", "] = inside.splits
    
    const channel = d.message.guild.channels.cache.get(channelID)
    
    if (!channel) return d.error(`❌ Invalid channel ID in \`$usersInChannel${inside}\``)
        
    const users = channel.members.map(m => options ==="mention" ? m.user.toString() : m.user[options.toLowerCase()]).join(separator).removeBrackets()
        
    return {
        code: code.replaceLast(`$usersInChannel${inside}`, users)
    }
} 