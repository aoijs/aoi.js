module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const fields = inside.splits

    const userID = fields.shift()

    const member = await d.message.guild.members.fetch(userID).catch(err => {})

    if (!member) return d.error(`:x: invalid user ID in \`$giveRoles${inside}\``)

    const m = await member.roles.add(fields).catch(Err => {})

    if (!m) return d.error(`:x: Failed to add roles to ${member.user.username}!`)

    return {
        code: code.replaceLast(`$giveRoles${inside}`, "")
    }
}