const interpreter = require("../interpreter.js")
const alwaysExecuteCommands = require("./alwaysExecuteCommands")
const nonPrefixedCommands = require("./nonPrefixedCommands.js")
//const testInterpreter = require("../testInterpreter") 

const CommandHandler = async (client, message, db) => {

  if (client.messageEventOptions.guildOnly && message.channel.type === "dm") return

  if (!client.messageEventOptions.respondToBots && message.author.bot) return 
  
  const prefixes = []

  for (const prefix of client.prefix) {
    if (prefix.includes("$")) {
      prefixes.push((await interpreter(client, message, message.content.split(" "), {
        name: "custom prefix",
        code: prefix
      }, db, true) || "UNDEFINED").addBrackets())
    } else {
      prefixes.push(prefix)
    }
  }

  const prefix = prefixes.filter(e => e !== "UNDEFINED").find(prefix => prefix === "" ? true : message.content.toLowerCase().startsWith(prefix.toLowerCase()))

  if (prefix === undefined) return nonPrefixedCommands(client, message, db)

  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  
  const cmd = args.shift().toLowerCase()
  
  const cmds = client.bot_commands.array()

  const commands = cmds.filter(c => c.name !== "$alwaysExecute" && c.nonPrefixed !== true).filter(c => (c.name || "").toLowerCase() === cmd || (c.aliases && typeof c.aliases === "object" ? c.aliases.includes(cmd) : c.aliases === cmd))
  
  for (const command of commands) {
    if (command.asynchronous === false) interpreter(client, message, args, command, undefined) 
    else await interpreter(client, message, args, command, undefined)  
    //await interpreter(client, message, args, command, undefined)
  } 
}

module.exports = CommandHandler