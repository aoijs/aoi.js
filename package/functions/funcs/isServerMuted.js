module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const user = await d.message.guild.members.fetch(inside.inside).catch(err => {})
    
    if (!user) return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)
        
    return {
        code: code.replaceLast(`$isServerMuted${inside}`, user.voice.serverMute)
    }
}  
