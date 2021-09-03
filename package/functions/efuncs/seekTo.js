const execute = require("../../handlers/MusicPlayer");

const seek = async d => {
	const code = d.command.code
	const r = code.split("$seekTo").length - 1
	const inside = code.split("$seekTo")[r].after()
	const server = d.client.servers.get(d.message.guild.id)

	if (!server || !server.connection.dispatcher) {
		return d.error(":x: Nothing is being played!")
	}

	if (!inside.inside) {
		return d.error(`:x: Command \`$seekTo\` is invalid`)
	}

	if (isNaN(parseInt(inside.inside))) {
		return d.error(`:x: Field \`${inside.inside}\` is not a Number in \`$seekTo${inside.total}\``)
	}

	if (server.songs[0].duration().split(' ')[0] == 0) {
		return {
			code: code.replaceLast(`$seekTo${inside.total}`, '')
		}
	}

	if (!server.ffmpegArgs) server.ffmpegArgs = { }

	server.ffmpegArgs.seek = parseInt(inside.inside)

	d.client.servers.set(d.message.guild.id, server)

	server.connection.dispatcher.end()

	return {
		code: d.command.code.replaceLast(`$seekTo${inside.total}`, "")
	}

}

module.exports = seek