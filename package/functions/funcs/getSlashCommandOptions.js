const axios = require("axios") 

module.exports = async d => {
    const code = d.command.code 
    
    const r = code.split(`$getSlashCommandOptions`).length - 1 
    
    const inside = code.split(`$getSlashCommandOptions`)[r].after()

	const err = d.inside(inside)

if (err) return d.error(err)

    
    const [name, guildID = d.message.guild.id] = inside.splits
    
    let commands = await axios.get(d.client._api(`/applications/${d.client.user.id}/guilds/${guildID}/commands`), {
        headers: {
            Authorization: `Bot ${d.client.token}`
        }
    }).catch(err => null) 
    
    if (!commands) return d.error(`❌ Failed to fetch slash commands`) 
    
    else commands = commands.data 
    
    const command = commands.find(c => c.name.toLowerCase() === name.toLowerCase())
    
    return {
        code: code.replaceLast(`$getSlashCommandOptions${inside}`, (command && command.options) ? command.options.map(data=> {
            return `${data.name}:${data.description}:${data.required === true}:${data.type}`
        }).join(";") : "")
    }
}