module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const fields = inside.splits

    const userID = fields.shift()

    const member = await d.message.guild.members.fetch(userID).catch(err => {})

    if (!member) return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)

    const m = await member.roles.remove(fields).catch(Err => {})

    if (!m) return d.error(`\`Failed to remove roles from ${member.user.username}\``)

    return {
        code: code.replaceLast(`$takeRoles${inside}`, "")
    }
}