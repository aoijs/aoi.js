const interpreter = require("../interpreter.js")

module.exports = async (client, message, db) => {

//hey when music 
  const commands = client.bot_commands.array().filter(c => c.nonPrefixed)

    if (!commands.length) return

    const cmds = commands.filter(c => message.content.toLowerCase().startsWith(c.name.toLowerCase())) 
		
		cmds.push(...commands.filter(c => c.aliases && c.aliases.some(a => message.content.toLowerCase().startsWith(a.toLowerCase()))))

    if (!cmds.length) return

    for (const command of cmds) {
        const args = message.content.slice(command.name.length).split(" ")

        await interpreter(client, message, args, command, db, false)
    }
}