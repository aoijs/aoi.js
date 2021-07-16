module.exports = async d => {
	const code = d.command.code;

	if (!d.client.bot.paths.length)
		return d.error(
			`\`Function <Bot>.loadCommands(path) was not used for the command handler\``
		);
	for (const key of Object.keys(d.client).filter(f => f.endsWith("commands"))) {
		d.client[key].sweep(cmd => {
			if (cmd.load) {
				if (cmd.loopInterval) clearInterval(cmd.loopInterval)

				return true
			}
		})
	}

	for (const dp of d.client.bot.paths) {
		await d.client.bot.loadCommands(dp.path, dp.debug)
	}

	return {
		code: code.replaceLast(`$updateCommands`, '')
	};
}; 
