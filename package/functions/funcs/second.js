module.exports = async d => {
	return {
		code: d.command.code.replaceLast("$second", `0${new Date(new Date().toLocaleString('en-US', {
			timeZone: d.timezone
		})).getSeconds()}`.substr(-2))
	}
}