module.exports = async d => {
	const code = d.command.code
	const inside = d.unpack()

	const [userID = d.message.author.id, separator = ','] = inside.splits

	const mutuals = await Promise.all(
		d.client.guilds.cache.map(async guild => {
			const member = await guild.members.fetch(userID).catch(d.noop)

			if (member) return guild.id

			return null
		})
	).then(rawMutuals => {
		return rawMutuals.filter(value => value)
	})

	return {
		code: code.replaceLast(`$mutualServers${inside}`, mutuals.join(separator))
	}
}