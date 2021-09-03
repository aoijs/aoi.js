module.exports = async d => {
	let code = d.command.code
	let res = ''
	let tz = d.timezone

	const r = code.split('$timezone').length - 1
	const inside = code.split('$timezone')[r].after()

	if (inside.inside) {
		try {
			new Date().toLocaleString('en-US', {
				timeZone: inside.inside
			})
		} catch {
			return d.error(`:x: Invalid timezone in $timezone${inside.total}`)
		}

		tz = inside.inside
	} else {
		res = tz
	}

	return {
		code: code.replaceLast(`$timezone${inside.total}`, res),
		timezone: tz
	}
}