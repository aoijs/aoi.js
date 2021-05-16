const axios = require('axios')
module.exports = async (client,commandID,guildID,oldData) =>{
   var res = "applicationCommandUpdate"
   if(guildID != "global" && !client.guilds.cache.get(guildID)) {res = "lol"}
    if(guildID == "global"){ 
        
setTimeout(async()=>{
   let d = await axios.get(client._api(`applications/${client.user.id}/commands/${commandID}`),{
       headers:{
           Authorization:`Bot ${client.token}`
           }
       })
   d = d.data
   let newData = {
       id: oldData.id,
       name: d.name,
       version: d.version,
       description:d.description,
       options: d.options || [],
       defaultPermission : d.default_permission ,
       guild : null ,
       application : client ,
       timestamp : oldData.timestamp,
       createdAt: oldData.createdAt 
       } 

 client.applications.slash.set(commandID,newData)
  client.emit(res,oldData,newData)
    },2000)
      
                     
                      }
    else{
        setTimeout(async()=>{

   let d = await axios.get(client._api(`applications/${client.user.id}/guilds/${guildID}/commands/${commandID}`),{

       headers:{

           Authorization:`Bot ${client.token}`

           }

       })

   d = d.data

   let newData = {

       id: oldData.id,
       version: d.version,
       name: d.name,

       description:d.description,

       options: d.options || [],

       defaultPermission : d.default_permission ,

       guild : client.guilds.cache.get(guildID) || null ,

       application : client ,

       timestamp : oldData.timestamp,

       createdAt: oldData.createdAt 

       } 

 client.applications.slash.set(commandID,newData)

  client.emit(res,oldData,newData)

    },2000)
        }
    }

    
