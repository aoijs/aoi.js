module.exports = async d => {
	let code = d.command.code

	const r = code.split('$moveUser').length - 1
	const inside = code.split('$moveUser')[r].after()

	const err = d.inside(inside)

	if (err) return d.error(err)

	const [ userID, channel = null, reason ] = inside.splits

	const user = await d.message.guild.members.fetch(userID).catch(err => {})

	if (!user) return d.error(`\`${d.func}: Invalid userID in ${inside.total}\``)

	const state = d.message.guild.voiceStates.cache.get(user.id)

	if (!state || !state.channel) return d.error(`\`${d.func}: User is not in any voice channel in ${inside.total}\``)

	try {
		await state.setChannel(channel && channel.length ? channel : null, reason)
	} catch {
		return d.error(`\`${d.func}: Failed to move user from a voice channel in ${inside.total}\``)
	}

	return {
		code: code.replaceLast(`$moveUser${inside.total}`, '')
	}
}