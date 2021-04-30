//here u go xd
module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const mentions =d.message.mentions 
    
    return {
        code: code.replaceLast(`$isMentioned${inside}`, inside.inside === "everyone" ? mentions.everyone : (mentions.roles.has(inside.inside) || mentions.channels.has(inside.inside) || mentions.users.has(inside.inside)))
    }
}