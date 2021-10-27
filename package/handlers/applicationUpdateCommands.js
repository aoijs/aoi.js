const interpreter = require("../interpreter.js")

module.exports = async (oldData,newData,client) => {
//gets the commands from the collection array
  for (const commands of client.application_cmd_update_commands.array()) {
    
let data = {
    oldData : oldData,
    newData : newData 
    }
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
        oldData: oldData,
        newData: newData
      }
    );
  }
};