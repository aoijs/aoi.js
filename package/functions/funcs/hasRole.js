module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const userID = inside.splits[0]

    const roleID = inside.splits[1]
    
    const guildID = inside.splits[2] || d.message.guild.id 
    
    const guild = d.client.guilds.cache.get(guildID) 
    
    if (!guild) return d.error(`\`${d.func}: Invalid guild ID in ${inside}\``)
    
    const member = await guild.members.cache.get(userID)

    if (!member) return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)

    return {
        code: code.replaceLast(`$hasRole${inside}`, member.roles.cache.has(roleID))
    }
}