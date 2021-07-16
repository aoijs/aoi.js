module.exports = async d => {
	let code = d.command.code

	const r = code.split('$muteUser').length - 1
	const inside = code.split('$muteUser')[r].after()

	const err = d.inside(inside)

	if (err) return d.error(err)

	const [ userID, mute = 'yes', reason ] = inside.splits

	const user = await d.message.guild.members.fetch(userID).catch(err => {})

	if (!user) return d.error(`\`${d.func}: Invalid userID in ${inside.total}\``)

	const state = d.message.guild.voiceStates.cache.get(user.id)

	if (!state || !state.channel) return d.error(`\`${d.func}: User is not in any voice channel in ${inside.total}\``)

	try {
		await state.setMute(mute.toLowerCase() === 'yes', reason)
	} catch {
		return d.error(`\`${d.func}: Failed to mute member in ${inside.total}\``)
	}

	return {
		code: code.replaceLast(`$muteUser${inside.total}`, '')
	}
}