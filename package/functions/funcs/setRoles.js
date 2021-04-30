module.exports = async d => {
	let code = d.command.code
	
	const r = code.split('$setRoles').length - 1
	const inside = code.split('$setRoles')[r].after()
	
	if (!inside.inside) return d.error(`:x: Invalid usage in $setRoles${inside.total}`)
	
	const [ userID, ...roles ] = inside.splits
	
	const m = await d.message.guild.members.fetch(userID).catch(err => null)
	
	if (!m) return d.error(`:x: Invalid userID in \`$setRoles${inside.total}\``)
	
	try {
		await m.roles.set(roles)
	} catch {
		return d.error(`:x: Failed to set roles to user in \`$setRoles${inside.total}\``)
	}
	
	return {
	 code: code.replaceLast(`$setRoles${inside.total}`, '')
	}
}