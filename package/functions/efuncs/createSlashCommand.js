const axios = require("axios");
const parser = require("../../Handler/slashCommandOptionsParser");
const {SlashOptionsParser} = require('../../Handler/parsers.js')
let typer ={
    slash:"CHAT_INPUT",
    user:"USER",
    message:"MESSAGE"
}
module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split(`$createSlashCommand`).length - 1;

  const inside = code.split("$createSlashCommand")[r].after();

  let [guildID, name, description, defaultPermission="yes",type="CHAT_INPUT",...opts] = inside.splits;
  let options ;
    if (opts.length) {

      try{

          if(opts.length === 1 && typeof JSON.parse(opts) === "object"){

          options = [JSON.parse(opts)]


              }

          }

      catch(e){



          if(!opts.join(" ").startsWith("{")){

              options = await parser(opts)

              }

          else{

              options = []

              for(let opt of opts){

   options=  options.concat((await SlashOptionsParser(opt||"")))

                  }

              }


              

          }

          }
    d.client.application.commands.create({
        name, description, defaultPermission,type, options
    }, guildID === "global"? undefined : guildID)
    return {
        code: code.replaceLast(`${d.func}${inside}`,"")
    }
}

