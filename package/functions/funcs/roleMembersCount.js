module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const role = d.message.guild.roles.cache.get(inside.inside) 
    
    if (!role) return message.channel.send(`\`${d.func}: Invalid role ID in ${inside}\``)
    
    return {
        code: code.replaceLast(`$roleMembersCount${inside}`, role.members.size)
    }
}