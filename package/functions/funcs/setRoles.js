module.exports = async d => {
	let code = d.command.code
	
	const r = code.split('$setRoles').length - 1
	const inside = code.split('$setRoles')[r].after()

	const err = d.inside(inside)
	if (err) return d.error(err)
	
	const [ userID, ...roles ] = inside.splits
	
	const m = await d.message.guild.members.fetch(userID).catch(err => null)
	
	if (!m) return d.error(`\`${d.func}: Invalid userID in ${inside.total}\``)
	
	try {
		await m.roles.set(roles)
	} catch {
		return d.error(`\`${d.func}: Failed to set roles to user in ${inside.total}\``)
	}
	
	return {
	 code: code.replaceLast(`$setRoles${inside.total}`, '')
	}
}