module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const fields = inside.splits

    const userID = fields.shift()

    const member = await d.message.guild.members.fetch(userID).catch(Err => {})

    if (!member) return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)

    return {
        code: code.replaceLast(`$hasRoles${inside}`, fields.every(id => member.roles.cache.has(id)))
    }
}