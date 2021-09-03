const fetch = require("../../handlers/request")
const embed = require("../../handlers/errors.js")
const execute = require("../../handlers/MusicPlayer.js")
const msp = require("ms-parser")
const pms = require("parse-ms")

module.exports = async d => {
	const code = d.command.code
	const inside = d.unpack()

	let [
		url,
		client_id,
		time = "1s",
		deafen = 'no',
		leaveEmpty = "no",
		error = ":x: Error while making the request."
	] = inside.splits
	url = url.addBrackets().trim()
	try {
		time = msp(time).ms
	} catch {
		time = msp("1s").ms
	}
	deafen = (deafen === "yes")
	let video
	if (!client_id) console.warn("soundcloud client_id is empty in $playSoundCloud, your bot could get rate limited if none was added. \nIf you don't know how to get one, Please follow this Procedure" + `
--------------------------------------------------------------------------
    1. Go to any SoundCloud Tracks
    2. Press f12 and go to Networks Tab (CTRL+R when you're there)
    3. Find any file that include \`client_id\`
    4. Copy paste the value from client_id to $playSoundCloud
--------------------------------------------------------------------------`)
	let response = await fetch("https://api.leref.ga/soundcloud?url=" + encodeURIComponent(url))
	let json = response.json
	if (json.statusText === "NOT OK") {
		console.log(json.message + " - StatusCode: " + json.status)
		return embed(d, error)
	}
	video = json.songInfo
	const info = {
		title: () => video.title.removeBrackets(),
		description: () => video.description,
		duration: () => Math.floor(video.duration / 1000) + " Seconds " + new Date(video.duration).toISOString().substr(11, 8).split(":").filter(dur => dur !== "00").join(":"),
		duration_left: (server) => {
			if (!server) return;
			const ms = video.duration
			const time = Math.floor(ms - (server.connection.dispatcher.streamTime + (server.seek || 0)))
			const ISO = new Date(time).toISOString().substr(11, 11).split(":")

			if (ISO[0] === "00") {
				ISO.shift()
				ISO[1] = Math.floor(parseInt(ISO[1]))

				if (ISO[1].toString().length === 1) ISO[1] = "0" + ISO[1].toString()

			} else {
				ISO[2] = Math.floor(parseInt(ISO[2]))

				if (ISO[2].toString().length === 1) ISO[2] = "0" + ISO[2].toString()
			}

			return `${Math.floor(time / 1000)} Seconds (${ISO.join(":")})`
		},
		current_duration: (server) => {
			if (!server) return

			const ms = server.connection.dispatcher.streamTime + (server.seek || 0)
			const time = pms(ms)

			const secs = `0${time.seconds % 60}`.substr(-2)
			const mins = `0${time.minutes % 60}`.substr(-2)
			const hours = `0${time.hours % 60}`.substr(-2)
			const iso = [hours, mins, secs]

			if (time.days) iso.unshift(time.days)

			return `${Math.floor(ms / 1000)} Seconds (${iso.join(":")})`
		},
		thumbnail: () => video.thumbnail,
		publisher: () => video.author.name,
		publisher_url: () => video.author.url,
		userID: () => d.message.author.id,
		url: () => video.url,
		clientId: client_id,
		stream: "scdl",
		prune: false
	}

	const server = d.client.servers.get(d.message.guild.id)

	if (!server) {
		const vc =  d.message.member.voice.channel

		if (!vc) return embed(d, error);

		;(async () => {
			const connection = vc.join().catch(err => {
				console.error("I was unable to Join, Reason: \n" + err)

				embed(d, "I was unable to join, Error: " + err.message)
			})

			const constructor = {
				voice: d.message.member.voice.channel,
				connection: connection,
				songs: [],
				loopSong: false,
				loopQueue: false,
				volume: null,
				text: d.message.channel,
				playing: true,
				state: "ENDED",
				pruneEnabled: false,
				vc_legacy: time,
				deafen: deafen,
				leave: leaveEmpty === "yes",
        execute: async () => { await execute(d, true, error) }
			}

			constructor.songs.push(info)
			constructor.volume = 100
			d.client.servers.set(d.message.guild.id, constructor)

			try {
				await execute(d, true, error)
			} catch (err) {
				console.log(err)

				return embed(d, error)
			}
		})()

	} else {
		server.songs.push(info)
		d.client.servers.set(d.message.guild.id, server)
		d.client.emit("MUSIC_ADDED")
		if (server.state === "ENDED") {
			execute(d, true, error).catch(err => {
				console.error(err)

				embed(d, error)
			})
		}
	}
	return {
		code: code.replaceLast(`$playSoundCloud${inside}`, video.title.removeBrackets())
	}
}