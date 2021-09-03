module.exports = async d => {
	let code = d.command.code

	const r = code.split('$loopStatus').length - 1
	const inside = code.split('$loopStatus')[r].after()
	const server = d.client.servers.get(d.message.guild.id)

	if (!server) return d.error(':x: Nothing is being played!')

	let status = 'none'

	if (server.loopSong) status = 'song'
	else if (server.loopQueue) status = 'queue'

	return {
		code: code.replaceLast(`$loopStatus${inside.total}`, status)
	}
}