module.exports = async d => {
	const code = d.command.code
	const inside = d.unpack()
	const userID = inside.inside || d.message.author.id

	const member = await d.message.guild.members.fetch(userID).catch(d.noop)

	if (!member) return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)

	const roles = member.roles.cache.sort((x, y) => y.position - x.position)
	const role = (roles.find(role => role.hoist) || { id: d.message.guild.id }).id

	return {
		code: code.replaceLast(`$hoistedRole${inside}`, role)
	}
}