module.exports = async d => {
	let ram = `${process.env.SERVER_MEMORY} MB`

	return {
		code: d.command.code.replaceLast(`$maxRam`, ram)
	}
}
