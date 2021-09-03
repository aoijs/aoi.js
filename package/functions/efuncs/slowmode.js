const ms = require("ms")

module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [channelID, slowmode] = inside.splits
    
    const channel = d.message.guild.channels.cache.get(channelID)
    
    if (!channel) return d.error(`❌ Invalid channel ID in \`$slowmode${inside}\``)
        
    const time = slowmode === "0" ? 0 : ms(slowmode)
        
    if (time === undefined) return d.error(`❌ Invalid time in \`$slowmode${inside}\``)
        
    const ch = await channel.edit({
        rateLimitPerUser: time / 1000
    }).catch(err => {})
    
    if (!ch) return d.error(`❌ Failed to change slowmode for ${channel.name}`)
        
    return {
        code: code.replaceLast(`$slowmode${inside}`, "")
    }
}

