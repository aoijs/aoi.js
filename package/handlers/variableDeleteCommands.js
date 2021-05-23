const interpreter = require("../interpreter.js")

module.exports = async (client,db,variable,key,value,type, timestamp) => {
//gets the commands from the collection array
  for (const commands of client.variable_delete_commands.array()) {
const data = {}
    
      //gets the var info of variable that was created 
     data.variable= variable
     data.key= key
     data.value = value
     data.type = type
    data.timestamp= timestamp
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
oldv: data,
newv :{variable:[""],key:[""],value:[""],type:[""], timestamp:["0"]}
      }

    );

  }

};