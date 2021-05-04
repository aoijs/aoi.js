const axios = require("axios") 
const parser = require("../../handlers/slashCommandOptionsParser") 
module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.after()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    let [guildID, commandID, name, description, ...opts] = inside.splits
    
    let options 
    
    if (opts.length) {
        options = parser(opts)
    }
    let request;
    if(guildID == "global"){
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
    if (!request) return d.error(`❌ Failed to modify slash command`)
    return {
        code: code.replaceLast(`$modifySlashCommand${inside}`, "")
    }
} 
