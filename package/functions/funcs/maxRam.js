const os = require('os')
module.exports = async d => {
	let ram = os.totalmem() / 1024 / 1024

	ram = ram.toFixed(2)

	return {
		code: d.command.code.replaceLast(`$maxRam${d.unpack()}`, String(ram))
	}
}