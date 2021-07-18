

module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const fields = inside.splits

    const userID = (Number(fields[0]) && fields[0].length > 17 && fields[0].length <= 19 && !d.message.guild.roles.cache.get(fields[0] )) ? fields.shift() : d.message.author.id

    const member = await d.message.guild.members.fetch(userID).catch(err => null)

    if (!member) return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)

    const roles = fields 

    if (roles.some(id => d.message.guild.roles.cache.get(id) === undefined)) return d.error(`\`${d.func}: Invalid role ID given in ${inside}\``)

    return {
        code: code.replaceLast(`$hasAnyRole${inside}`, member.roles.cache.some(r => roles.includes(r.id)))
    }
}