const songFilters = require('../../utils/songFilter')

module.exports = async d => {
	let code = d.command.code

	const r = code.split('$songFilter').length - 1
	const inside = code.split('$songFilter')[r].after()
	const server = d.client.servers.get(d.message.guild.id)

	if (!server || !server.songs.length || !server.connection.dispatcher)
		return d.error(':x: No song is playing')
		
	if (!inside.inside)
		return d.error(`:x: Invalid usage in $songFilter${inside.total}`)

	let i = 0

	while (i < inside.splits.length) {
		const [ type ] = inside.splits[i].split(':')

		if (!songFilters[type]) return d.error(`:x: Invalid song filter \`${type}\` in \`$songFilter${inside.total}\``)

		i++
	}

	i = 0

	if (server.songs[0].duration().split(' ') == 0) {
		return {
			code: code.replaceLast(`$songFilter${inside.total}`, '')
		}
	}

	if (!server.ffmpegArgs)
		server.ffmpegArgs = { }

	if (!server.ffmpegArgs.filter)
		server.ffmpegArgs.filter = { }

	//Deep-copy
	const old = JSON.parse(JSON.stringify(server.ffmpegArgs.filter))

	while (i < inside.splits.length) {
		const [ type, value = '' ] = inside.splits[i].split(':')
		const filtrs = songFilters[type].split(';').slice(2)
		const exp = filtrs.pop()

		const filters = splitArray(filtrs, 2)
		const bool = !value.length ||
			isNaN(value) ||
			!eval(exp.replace(/\{value\}/g, value))

		let f = 0

		while (f < filters.length) {
			const [ name, prop ] = filters[f]

			if (!bool)
				server.ffmpegArgs.filter[name] = prop.replace(
					/\{value\}/g,
					value
				)
			else
				delete server.ffmpegArgs.filter[name]

			f++
		}

		i++
	}

	const newFilter = server.ffmpegArgs.filter

	if (!Object.keys(server.ffmpegArgs.filter).length)
		delete server.ffmpegArgs.filter

	const equal = [old, Object.keys(old), newFilter]
	const lengths = [Object.keys(old).length, Object.keys(newFilter).length]

	if (lengths[0] == lengths[1] && isEqual(...equal))
		return {
			code: code.replaceLast(`$songFilter${inside.total}`, '')
		}

	const duration = server.connection.dispatcher.streamTime +
		(server.seek || 0)

	server.ffmpegArgs.seek = Math.floor(duration / 1000)

	d.client.servers.set(d.message.guild.id, server)

	server.connection.dispatcher.end()

	return {
		code: code.replaceLast(`$songFilter${inside.total}`, '')
	}
}

function splitArray(array, pages = 2) {
	if (!array.length) return []

	const chunks = []

	for (let i = 0; i < array.length;) {
		chunks.push(array.slice(i, i += pages))
	}

	return chunks
}

function isEqual(filter, keys, data) {
  for (const key of keys) {
		if (Array.isArray(filter[key]) && Array.isArray(data[key])) {
			const res = parseArray(filter[key], data[key])

			if (!res) return false
		} else if (filter[key] instanceof Object && data[key] instanceof Object) {
			const res = isEqual(filter[key], Object.keys(filter[key]), data[key])

			if (!res) return false
		} else if (filter[key] !== data[key]) return false
	}

	return true
}

function parseArray(filter, data) {
	if (filter.length > data.length) return false

	const parsed = []

	let id = 0
	
	while (id < data.length) {
		if (parsed.length === filter.length) return true

		let i = 0

		while (i < filter.length) {
			if (parsed.length === filter.length) return true
			if (parsed.indexOf(i) > -1) continue

			if (Array.isArray(filter[i]) && Array.isArray(data[id])) {
				const res = parseArray(filter[i], data[id])

				if (res) parsed.push(i)
			} else if (filter[i] instanceof Object && data[id] instanceof Object) {
				const res = isEqual(filter[i], Object.keys(filter[i]), data[id])

				if (res) parsed.push(i)
			} else if (filter[i] === data[id]) parsed.push(i)

			i++
		}

		id++
	}

	if (parsed.length === filter.length) return true

	return false
}