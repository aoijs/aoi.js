module.exports = async d => {
	let code = d.command.code

	const r = code.split('$muteUser').length - 1
	const inside = code.split('$muteUser')[r].after()

	if (!inside.splits.length) return d.error(`:x: Invalid usage in $muteUser${inside.total}`)

	const [ userID, mute = 'yes', reason ] = inside.splits

	const user = await d.message.guild.members.fetch(userID).catch(err => {})

	if (!user) return d.error(`:x: Invalid userID in \`$muteUser${inside.total}\``)

	const state = d.message.guild.voiceStates.cache.get(user.id)

	if (!state || !state.channel) return d.error(`:x: User is not in any voice channel in \`$muteUser${inside.total}\``)

	try {
		await state.setMute(mute.toLowerCase() === 'yes', reason)
	} catch {
		return d.error(`:x: Failed to mute member in \`$muteUser${inside.total}\``)
	}

	return {
		code: code.replaceLast(`$muteUser${inside.total}`, '')
	}
}