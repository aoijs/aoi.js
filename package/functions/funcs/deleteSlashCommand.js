const {SnowflakeUtil} = require('discord.js')
const axios = require("axios");
const parser = require("../../handlers/slashCommandOptionsParser");
module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split(`$deleteSlashCommand`).length - 1;

  const inside = code.split(`$deleteSlashCommand`)[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [guildID, option] = inside.splits;
let command;
  let commands;
    if(guildID == "global"){
        if(d.client.aoi.options.applicationCache){
        commands = d.client.applications.slash.filter(x=>(x.name.toLowerCase() == option.toLowerCase() && x.guild == null) || (x.id == option && x.guild == null)).array()
            }
      else{
        commands = await axios.get(d.client._api(`applications/${d.client.user.id}/commands`),{
            headers:{
              Authorization:`Bot ${d.client.token}`
}
            })
          
           }
       
    }
    else{
        d.client.applications.slash.filter(x=>(x.name.toLowerCase() == option.toLowerCase() && x.guild ? x.guild.id == guildID: "")|| (x.id == option && x.guild ? x.guild.id== guildID : "")).array()
        if(!commands){
    commands = await axios
    .get(
      d.client._api(`/applications/${d.client.user.id}/guilds/${guildID}/commands`),
      {
        headers: {
          Authorization: `Bot ${d.client.token}`,
        },
      }
    )
    .catch((err) => null);
}
  if (!commands) return d.error(`:x: Failed to fetch guild commands`);
  else commands = commands.data;
}
  command = commands.find(
    (c) => c.name.toLowerCase() === option.toLowerCase() || c.id === option
  );

  if (!command)
    return d.error(`❌ Could not find any command with name/id ${option}`);
   command = {

       id: command.id,

       name: command.name,

       description:command.description,

       options: command.options || [],

       defaultPermission : command.default_permission ,

       guild : d.client.guilds.cache.get(command.guild_id) || null,

       application : d.client ,

       timestamp : SnowflakeUtil.deconstruct(command.id).timestamp, 

       createdAt: SnowflakeUtil.deconstruct(command.id).date

       } 
d.client.emit("applicationCommandDelete",d.client,command)
  const request = axios
    .delete(
      d.client._api(
        `/applications/${d.client.user.id}/guilds/${guildID}/commands/${command.id}`
      ),
      {
        headers: {
          Authorization: `Bot ${d.client.token}`,
        },
      }
    )
    .catch((err) => null);

  if (!request)
    return d.error(`❌ Failed to delete slash command ${command.name}`);

  return {
    code: code.replaceLast(`$deleteSlashCommand${inside}`, ""),
  };
};
