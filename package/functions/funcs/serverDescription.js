module.exports = async d => {
	return {
		code: d.command.code.replaceLast(`$serverDescription`, d.message.guild.description || "") 
	}
}