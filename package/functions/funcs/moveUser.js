module.exports = async d => {
	let code = d.command.code

	const r = code.split('$moveUser').length - 1
	const inside = code.split('$moveUser')[r].after()

	if (!inside.splits.length) return d.error(`:x: Invalid usage in $moveUser${inside.total}`)

	const [ userID, channel = null, reason ] = inside.splits

	const user = await d.message.guild.members.fetch(userID).catch(err => {})

	if (!user) return d.error(`:x: Invalid userID in \`$moveUser${inside.total}\``)

	const state = d.message.guild.voiceStates.cache.get(user.id)

	if (!state || !state.channel) return d.error(`:x: User is not in any voice channel in \`$moveUser${inside.total}\``)

	try {
		await state.setChannel(channel && channel.length ? channel : null, reason)
	} catch {
		return d.error(`:x: Failed to move user from a voice channel in \`$moveUser${inside.total}\``)
	}

	return {
		code: code.replaceLast(`$moveUser${inside.total}`, '')
	}
}