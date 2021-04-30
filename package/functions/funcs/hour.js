module.exports = async d => {
	return {
		code: d.command.code.replaceLast("$hour", `0${new Date(new Date().toLocaleString('en-US', {
			timeZone: d.timezone
		})).getHours()}`.substr(-2))
	}
}