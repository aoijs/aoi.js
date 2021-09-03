const ms = require("parse-ms")
const parse = require("ms-parser")

module.exports = async d => {
	const code = d.command.code

	const inside = d.unpack()

	if (inside.inside) {
		const [
			userID,
			date = "date"
		] = inside.splits

		const m = await d.message.guild.members.fetch(userID).catch(err => { })

		if (!m) return d.error(`:x: Invalid user ID in \`$memberJoinedDate${inside}\``)

		let opt

		if (date === "ms") {
			return {
				code: code.replaceLast(`$memberJoinedDate${inside}`, m.joinedTimestamp)
			}
		}


		if (date === "date") {
			opt = new Date(m.joinedTimestamp).toLocaleString('en-US', {
				timeZone: d.timezone
			})
		} else {
			opt = parse(Object.entries(ms(Date.now() - m.joinedTimestamp)).map((x, y) => {
				if (x[1] && y < 4) return `${x[1]}${x[0][0]}`
				return undefined
			}).filter(e => e).join("")).string
		}

		return {
			code: code.replaceLast(`$memberJoinedDate${inside}`, opt)
		}
	} else {
		return {
			code: code.replaceLast(`$memberJoinedDate`, parse(Object.entries(ms(Date.now() - d.message.member.joinedTimestamp)).map((x, y) => {
				if (x[1] && y < 4) return `${x[1]}${x[0][0]}`
				return undefined
			}).filter(e => e).join("")).string)
		}
	}
}