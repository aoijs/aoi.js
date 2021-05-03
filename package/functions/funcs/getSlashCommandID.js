const axios = require("axios") 

module.exports = async d => {
    const code = d.command.code 
    
    const r = code.split(`$getSlashCommandID`).length - 1 
    
    const inside = code.split(`$getSlashCommandID`)[r].after()

	if (!inside.inside) return d.error(`:x: Invalid usage in $getSlashCommandID${inside}`)
    
    const [name, guildID = d.message.guild.id] = inside.splits
    let commands;
    let command;
    if(guildID == "global"){
        commands = await axios.get(d.client._api(`/applications/${d.client.user.id}/commands`), {

        headers: {

            Authorization: `Bot ${d.client.token}`

        }

    }).catch(err => null) 

    

    if (!commands) return d.error(`❌ Failed to fetch slash commands`) 

    

    else commands = commands.data 

    

    command = commands.find(c => c.name.toLowerCase() === name.toLowerCase())
    }
    else{
    commands = await axios.get(d.client._api(`/applications/${d.client.user.id}/guilds/${guildID}/commands`), {
        headers: {
            Authorization: `Bot ${d.client.token}`
        }
    }).catch(err => null) 
    
    if (!commands) return d.error(`❌ Failed to fetch slash commands`) 
    
    else commands = commands.data 
    
    command = commands.find(c => c.name.toLowerCase() === name.toLowerCase())
    }
    return {
        code: code.replaceLast(`$getSlashCommandID${inside}`, command ? command.id : "")
    }
}
