const interpreter = require("../../interpreter.js")
module.exports = async d => {
 
  const code = d.command.code
  
  const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
 
  const content = []

  const commands = inside.splits
      
  for (const value of d.array) {
    for (const command of commands) {
      const cmd = d.client.awaited_commands.find(c => c.name === command)

      if (!cmd) return d.error(`\`${d.func}: Invalid awaited command '${command}' in ${inside}\``)

      const newArgs = [...d.args]

      newArgs.unshift(value)

      const code = await interpreter(d.client, d.message, newArgs, cmd, undefined, true)

      if (code) content.push(code)
    }
  }

  return {
    code: code.replaceLast(`$textSplitMap${inside}`, content.join("\n")) 
  } 
} 