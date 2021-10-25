const interpreter = require("../interpreter.js")

module.exports = async (client,db,oldv,newv) => {
//gets the commands from the collection array
  for (const commands of client.variable_update_commands.array()) {
const data = {}
    
      //gets the var info of variable that was created 
     data.oldv = oldv
     data.newv = newv 
    
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
      db,
      false,
      undefined,
      {
        newv: data.newv,
        oldv : data.oldv
      }
     );
  }
};