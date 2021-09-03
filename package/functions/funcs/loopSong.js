module.exports = async d => {
	const server = d.client.servers.get(d.message.guild.id)
	
	if (!server) return d.error(':x: Nothing is playing!')
	
	if (server.loopSong === undefined) server.loopSong = false
	
	server.loopSong = server.loopSong === false
	
	d.client.servers.set(d.message.guild.id, server)
	
	return {
		code: d.command.code.replaceLast('$loopSong', server.loopSong)
	}
}