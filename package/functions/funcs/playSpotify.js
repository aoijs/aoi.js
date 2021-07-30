const execute = require("../../handlers/MusicPlayer")
const spotify = require('spotify-url-info')
const msp = require("ms-parser")
const pms = require("parse-ms")
const SpotifySearchHandler = require("../../handlers/spotifySearch")

var timeout;

module.exports = async d => {
	const code = d.command.code
	const search = d.client.ytSearch
	const inside = d.unpack()
	let [
		url,
		showsuccess = "",
		time = "1s",
		deafen = true,
		leaveEmpty = "no",
    	useFilter = "yes",
		error = `\`${d.func}: Error while making the request\``
	] = inside.splits
	let list = []

	try {
		time = msp(time).ms
	} catch {
		time = msp("1s").ms
	}

	deafen = (deafen === "yes")
  useFilter = (deafen === "yes")

	try {
		list = await spotify.getTracks(url.addBrackets())
	} catch {
		return d.error(`\`${d.func}: Error while making the request\``);
	}


	const server = d.client.servers.get(d.message.guild.id)

	if (!server) {
		const vc = d.message.member.voice.channel

		if (!vc) return d.error(`\`${d.func}: Error while making the request\``);

			const connection = vc.join().catch(err => {
				console.error("Unable to Join, Reason: \n" + err)
				d.error("Unable to join, Error: " + err.message)
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
				vc_legacy: time,
				deafen: deafen,
				pruneEnabled: false,
				leave: leaveEmpty === "yes",
        execute: async () => { await execute(d, true, error) }
			}
			constructor.volume = 100
			d.client.servers.set(d.message.guild.id, constructor)

      
	}

  const Handler = new SpotifySearchHandler(d.client, d.message.guild.id, list, (video) => {
    const obj =  {
      title: () => video.title.removeBrackets(),
		description: () => video.description,
		duration: () => video.duration.toString().split("seconds").join("Seconds"),
		thumbnail: () => video.thumbnail,
		duration_left: (server) => {
			if (!server) return;
			const ms = msp(obj.duration().split(" ")[0] + "s").ms
			const time = Math.floor(ms - (server.connection.dispatcher.streamTime + (d.client.servers.get(d.message.guild.id).seek || 0)))
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
		publisher: () => video.author.name,
		publisher_url: () => video.author.url,
		userID: () => d.message.author.id,
		url: () => video.url,
		stream: "ytdl",
		prune: false
    }

    return obj;
  }, d.client.ytSearch, (videos, song) => {

    if (useFilter) {
    return videos.find(vid => song.artists[0].name.split(' ').every(n => vid.title.includes(n))) || videos.find(vid => song.artists[0].name.split(' ').every(n => vid.author.name.includes(n)))
    } else {
      return videos[0]
    }
  } 
  , d, error)

		return {
			code: code.replaceLast(`$playSpotify${inside}`, "")
		}
}