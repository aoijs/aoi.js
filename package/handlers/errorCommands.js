const interpreter = require("../interpreter.js")

module.exports = async (client, err,db,command,message) => {
//gets the commands from the collection array
  for (const commands of client.function_error_commands.array()) {

    const data = {

      content:err,
    
      
      

    };
      let functype = require('util').inspect(data.content).replace(/`/g,"").replace(/'/g,"").split(" ")[require('util').inspect(data.content).replace(/`/g,"").replace(/'/g,"").split(" ").findIndex(x=>x.startsWith("$"))]
      
      let filetype = require('util').inspect(data.content).replace(/`/g,"").replace(/'/g,"").split(" ")[require('util').inspect(data.content).replace(/`/g,"").replace(/'/g,"").split(" ").findIndex(x=>x.includes("aoi.js/package/functions/funcs/"))]
      //gets the function that caused error 
      let func = data.content && typeof data.content == "string"? functype ? functype.split("[").slice(0,1).join("") : undefined : filetype ? "$"+filetype.split("aoi.js/package/functions/funcs/").slice(1,2).join(" ").split(":")[0].split("\n").join("").replace(".js","") : undefined|| "Couldn't Find The Function"
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

    //if (!channel) return console.error(`channel with ID ${id} does not exist`)
      //bunch of defining stuff 
      let p = {channel:ch, content:"",guild:ch.guild ,author:client.user} 
let e = message 
    data.channel= ch;
    data.command = command 
    data.function = func 
    data.message = e.message == "" ? p : e.message 
    data.chan = e.channel== "" ? p.channel : e.channel
    data.author = e.author == "" ? p.author : e.author
    data.guild = e.guild == "" ? p.guild : e.guild
let msg = data 
//interpreter does it's job 
    await interpreter(

      client,

      msg,

     msg.content? require("util").inspect(msg.content).split(" ") : [],

      commands,

      db,

      false,

      data.chan,

      {
err: data
        
      }

    );

  }

};
