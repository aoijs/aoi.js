module.exports = async d => {
	const code = d.command.code

	const inside = d.unpack()

	const data = {}

	if (inside.inside) {
		if (d.message.guild) {
			const member = await d.message.guild.members.fetch(inside.inside).catch(err => null)

			if (!member) return d.error(`❌ Invalid user ID in \`$userRoleColor${inside}\``)

			data.code = code.replaceLast(`$userRoleColor${inside}`, member.displayHexColor)
		} else data.code = code.replaceLast(`$userRoleColor${inside}`, "")
	} else {
		data.code = code.replaceLast(`$userRoleColor`, d.message.member ? d.message.member.displayHexColor : "")
	}

	return data
} 