const axios = require("axios") 

module.exports = async d => {
    const code = d.command.code 
    
    const r = code.split(`$getSlashCommandID`).length - 1 
    
    const inside = code.split(`$getSlashCommandID`)[r].after()

	if (!inside.inside) return d.error(`:x: Invalid usage in $getSlashCommandID${inside}`)
    
    const [name, guildID = d.message.guild.id] = inside.splits
    let cmd = d.client.application.commands.find(x=>x.name.toLowerCase() === name.toLowerCase() && ( guildID === "global" ? true : x.guildId === guildID))
    return {
        code: code.replaceLast(`$getSlashCommandID${inside}`, cmd?.id||"")
    }
}
