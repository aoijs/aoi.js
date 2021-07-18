const axios = require("axios") 
const {SnowflakeUtil} = require('discord.js')
const parser = require("../../handlers/slashCommandOptionsParser") 
module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    let [guildID, commandID, name, description, ...opts] = inside.splits
    let oldData;
    let options 
  let get;
    if (opts.length) {
        options = parser(opts)
    }
    let request;
    if(guildID == "global"){
  oldData = d.client.applications.slash.filter(x=>x.guild == null).find(x=>x.id == commandID) 
        if(!oldData){
     get = await axios.get(d.client._api(`applications/${d.client.user.id}/commands`),{
         headers:{
             Authorization: `Bot ${d.client.token}`
}
         }) 
            oldData = {

       id: get.id,

       name: get.name,

       description:get.description,

       options: get.options || [],

       defaultPermission : get.default_permission ,

       guild : d.client.guilds.cache.get(get.guild_id) || null,

       application : d.client ,

       timestamp : SnowflakeUtil.deconstruct(get.id).timestamp, 

       createdAt: SnowflakeUtil.deconstruct(get.id).date

       } 
            }
        d.client.emit("checkSlashUpdate",d.client,commandID,guildID,oldData)
       request = await axios.patch(d.client._api(`/applications/${d.client.user.id}/commands/${commandID}`), {

        name, 

        description, 

        options: options 

    }, {

        headers: {

            Authorization: `Bot ${d.client.token}`

        }

    }).catch(err => null) 
    }
    else{
        oldData = d.client.applications.slash.find(x=>x.id == commandID) 
        if(!oldData) {
             get = await axios.get(d.client._api(`/applications/${d.client.user.id}/guilds/${guildID}/commands/${commandID}`),{
                headers:{
                    Authorization:`Bot ${d.client.token}`
            }
                }) 
            get = get.data
            oldData = {

       id: get.id,

       name: get.name,

       description:get.description,

       options: get.options || [],

       defaultPermission : get.default_permission ,

       guild : d.client.guilds.cache.get(get.guild_id) || null,

       application : d.client ,

       timestamp : SnowflakeUtil.deconstruct(get.id).timestamp, 

       createdAt: SnowflakeUtil.deconstruct(get.id).date

       } 
            }
        d.client.emit("checkSlashUpdate",d.client,commandID,guildID,oldData)
        
   request = await axios.patch(d.client._api(`/applications/${d.client.user.id}/guilds/${guildID}/commands/${commandID}`), {
        name, 
        description, 
        options: options 
    }, {
        headers: {
            Authorization: `Bot ${d.client.token}`
        }
    }).catch(err => null) 
    }
    if (!request) return d.error(`\`SlashError: Failed to modify slash command\``)
    
    return {
        code: code.replaceLast(`$modifySlashCommand${inside}`, "")
    }
    
} 
