module.exports = async d => {
	let code = d.command.code

	const inside = d.unpack()
	const server = d.client.servers.get(d.message.guild.id)

	if (!server) return d.error(':x: Nothing is being played!')

	return {
		code: code.replaceLast(`$isPrune${inside.total}`, server.pruneEnabled === true)
	}
}