const axios = require('axios')
const ErrorParser = require('../../handlers/errorParser.js')
const ComponentParser = require('../../handlers/componentParser.js')
module.exports = async d=>{
    const inside = d.unpack() 
    const code = d.command.code 
    const err = d.inside(inside)
    if(err) return d.error(err) 
    const [content,embed = {},components=[],returnID="no"] = inside.splits 
    if(!content && embed === {} && embed === "") return d.error("Provide Either A Content Or A Embed Structure") 
   const e = embed === {} ? embed : await ErrorParser(embed) 
   
   const c = components === [] ? [] : await ComponentParser(components) 

 let msg =  await axios.post(d.client._api(`channels/${d.channel.id}/messages`),{
     content: content ,
     embed: e,
     components: c
         
  //   message_reference: msgReply
     },{
     headers:{
         Authorization:`Bot ${d.client.token}`
         }
     }).catch(e=>console.log(e.message))
// console.log(msg)
 return {
     code: code.replaceLast(`$apiMessage${inside}`,returnID === "no" ? "" : msg.data.id )
 }
}
