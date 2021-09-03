module.exports = async d => {
	let code = d.command.code
	
	const r = code.split('$queueStatus').length - 1
	const inside = code.split('$queueStatus')[r].after()
	const server = d.client.servers.get(d.message.guild.id)

	if (!server) return d.error(':x: Nothing is being played!')

	let status = 'idle'

	if (server.connection.dispatcher) {
		status = 'playing'

		if (server.connection.dispatcher.paused)
			status = 'paused'
	}

	return {
		code: code.replaceLast(`$queueStatus${inside.total}`, status)
	}
}