const axios = require("axios") 
const {SnowflakeUtil, Collection} = require ('discord.js') 
module.exports = async d => {

    const code = d.command.code 

    

    const r = code.split(`$getSlashCommandOptions`).length - 1 

    

    const inside = code.split(`$getSlashCommandOptions`)[r].after()

	const err = d.inside(inside)

if (err) return d.error(err)

    

    const [name, guildID = d.message.guild.id] = inside.splits

    

    let commands ;

 if(guildID == "global"){

    
commands = d.client.applications.slash.filter(x=>x.name.toLowerCase() == name.toLowerCase() && x.guild == null)
    if(commands.size == 0){
  commands =  await axios.get(d.client._api(`/applications/${d.client.user.id}/commands`), {

        headers: {

            Authorization: `Bot ${d.client.token}`

        }

    }).catch(err => null) 
        if (!commands) return d.error(`❌ Failed to fetch slash commands`) 

    

    else commands = commands.data 
}
    
}

else{
commands = d.client.applications.slash.filter(x=>x.name.toLowerCase() == name &&  x.guild != null )
    commands = commands.size != 0? commands.filter(x=>x.guild.id == guildID) : new Collection ()
    if(commands.size == 0){
 commands = await axios.get(d.client._api(`/applications/${d.client.user.id}/guilds/${guildID}/commands`), {

        headers: {

            Authorization: `Bot ${d.client.token}`

        }

    }).catch(err => null) 

    

    if (!commands) return d.error(`❌ Failed to fetch slash commands`) 

    

    else commands = commands.data 
        
        }
}
    const command = commands.find(c => c.name.toLowerCase() === name.toLowerCase())
command.options = command.options == [] ? undefined : command.options 
    if(d.client.aoi.options.applicationCache){
let c = {

    id : command.id,
    version : command.version,
    name: command.name ,
    description: command.description,
    options: command.options || [],
    guild : d.client.guilds.cache.get(command.guild_id) || null ,
    application: d.client ,
    defaultPermission : command.default_permission ,
    timestamp : SnowflakeUtil.deconstruct(command.id).timestamp ,
    createdAt : SnowflakeUtil.deconstruct(command.id).date,

}
d.client.applications.slash.set(c.id,c)
    }

    return {

        code: code.replaceLast(`$getSlashCommandOptions${inside}`, (command && command.options) ? (command.options[0] == "" ? undefined: (command.options.map(data=>`${data.name}:${data.description}:${data.required === true}:${data.type}`).join(";"))): undefined|| "")

           



    }

}
