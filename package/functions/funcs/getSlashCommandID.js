const axios = require("axios")

module.exports = async d => {
    const code = d.command.code
    
    const r = code.split(`$getSlashCommandID`)
        .length - 1
    
    const inside = code.split(`$getSlashCommandID`)[r].after()
    
    if (!inside.inside) return d.error(`\`${d.func}: Invalid usage in ${inside}\``)
    
    const [name, guildID = d.message.guild.id] = inside.splits
    let commands;
    let command;
    if (guildID == "global") {
        if (d.client.aoi.options.applicationCache) {
            commands = d.client.applications.slash.filter(x => x.guild == null)
        } else {
            commands = await d.client.api.applications(d.client.user.id)
                .commands.get()
                .catch(() => null)
        }
        
        
        if (!commands) return d.error(`\`SlashError: Failed to fetch slash commands\``)
        
        
        if (!d.client.aoi.options.applicationCache) {
            commands = commands.data ?? commands
        }
        
        
        command = commands.find(c => c.name.toLowerCase() === name.toLowerCase())
    } else {
        commands = d.client.applications.slash.find(x => x.guild ? x.guild.id == guildID : undefined && x.name == name)
        if (!commands) {
            commands = await d.client.api.applications(d.client.user.id)
                .guilds(guildID)
                .commands.get()
                .catch(err => null)
            if (!commands) return d.error(`\`SlashError: Failed to fetch slash commands\``)
            
        }
        
        command = commands.find(c => c.name.toLowerCase() === name.toLowerCase())
    }
    return {
        code: code.replaceLast(`$getSlashCommandID${inside}`, command ? command.id : "")
    }
}
