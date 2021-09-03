module.exports = async d => {
	return {
		code: d.command.code.replaceLast("$year", new Date(new Date().toLocaleString('en-US', {
			timeZone: d.timezone
		})).getFullYear())
	}
}