const axios = require("axios") 
const {SnowflakeUtil, Collection} = require ('discord.js') 
module.exports = async d => {

    const code = d.command.code 
    const inside = d.unpack() 
    const err = d.inside(inside) 
    if(err) return d.error(err) 
    const [guildId,name] = inside.splits;
   const cmd =  d.client.application.commands.find(x=>x.name.toLowerCase() === name.toLowerCase() &&( guildId === "global" ? true : x.guildId === guildId )) 


    return {

        code: code.replaceLast(`$getSlashCommandOptions${inside}`, cmd.options?.map(x=>x.name).join(" , ")||"")
}
           }



    


