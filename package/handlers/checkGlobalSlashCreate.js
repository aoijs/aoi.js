const axios = require('axios')
module.exports = async (type,name, client ) =>{
    let d;
    let command;
   var res = "applicationCommandCreate"
    if(type == "global"){ 
        
   setTimeout(async ()=>{
  d = await axios.get(client._api(`/applications/${client.user.id}/commands`),{
          headers:{
              Authorization:`Bot ${client.token}`
              }
          })
  command = d.data.find(x=>x.name == name) 
      if(!command){res = "e"}
        
    await client.emit(res,command)
      },2000)
   }
    else {

setTimeout(async ()=>{
  d = await axios.get(client._api(`/applications/${client.user.id}/guilds/${type}/commands`),{
          headers:{
              Authorization:`Bot ${client.token}`
              }
          })
  command = d.data.find(x=>x.name == name) 
if(!command){res = "e"}
     await client.emit(res,command)
        },2000) 
    }
  }