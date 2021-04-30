module.exports = async d=> {
    return {
        code: d.command.code.replaceLast("$minute", `0${new Date(new Date().toLocaleString('en-US', {
					timeZone: d.timezone
				})).getMinutes()}`.substr(-2))
    }
}