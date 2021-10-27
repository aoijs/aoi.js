const interpreter = require("../interpreter.js")
const axios = require('axios')
module.exports = async (client, application) => {
//gets the commands from the collection array
  for (const commands of client.application_cmd_delete_commands.array()) {
        
const data = {
    id : application.id,
    version: application.version ,
    application: client,
    defaultPermission : application.default_permission ,
    name: application.name,
    description: application.description ,
    options: application.options ||[] ,
    guild: client.guilds.cache.get(application.guild_id)|| null ,
    timestamp :application.timestamp || Date.now() ,
    createdAt: application.createdAt || new Date()
    }
  
const newdata = {
    id : "",
    version: "" ,
    application: "",
    defaultPermission : "",
    name: "",
    description:"",
    options:"",
    guild: {id:""},
    timestamp :"",
    createdAt: ""
    }
   if(client.aoi.options.applicationCache){
client.applications.slash.delete(application.id)}
      //gets the  info of application that was created 
  
//channel: part 
    const id =
      commands.channel && commands.channel.includes("$")
        ? await interpreter(
            client,
            data,
            [],
            {
              channel: commands.channel,
              code: commands.channel,
            },
            undefined,
            true
          )
        : commands.channel;
//verify if its exist 
    const ch = client.channels.cache.get(id);
data.channel = ch
    //if (!channel) return console.error(`channel with ID ${id} does not exist`)
     let msg = data 

//interpreter does it's job 
    await interpreter(
      client,
      msg,
      [],
      commands,
     undefined,
      false,
      undefined,
      {
        oldData: data,
        newData: newdata 

      }
    );
  }
};