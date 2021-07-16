module.exports = async d => {
	const code = d.command.code

	const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

	const [
		roleID,
		name,
		color,
		hoisted,
		mentionable
	] = inside.splits

	const role = d.message.guild.roles.cache.get(roleID)

	if (!role) return d.error(`\`${d.func}: Invalid role ID in ${inside}\``)

	const ROLE = await role.edit({
		name: name || role.name,
		color: color || role.color,
		mentionable: mentionable ? mentionable === "yes" : undefined,
		hoisted: hoisted ? hoisted === "yes" : undefined
	}).catch(err => { })

	if (!ROLE) return d.error(`\`Failed to modify ${role.name}\``)

	return {
		code: code.replaceLast(`$modifyRole${inside}`, "")
	}
}