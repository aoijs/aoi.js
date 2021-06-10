const axios = require('axios')
const ErrorParser = require('../../handlers/errorParser.js')
const ComponentParser = require('../../handlers/componentParser.js')
module.exports = async d=>{
    const inside = d.unpack() 
    const code = d.command.code 
    const err = d.inside(inside)
    if(err) return d.error(err) 
    const [content,embed = "",components=[],msgReply = "" ,returnID="no"] = inside.splits 
    if(!content  && embed === "") return d.error("Provide Either A Content Or A Embed Structure") 
   const e =embed !== "" ? await ErrorParser(embed) : {}
    //console.log(e)
   const c = components === [] ? [] : await ComponentParser(components) 
 //  console.log(JSON.stringify(c,null,2))

const data = {  content: content ,
     embed: e,
     components: c,
     allowed_mentions : {parse:d.disabledMentions} 
}
if(msgReply !== ""){
       let [Reply,mention = false] = msgReply.split(":")

  data.message_reference= {message_id : Reply} 
    data.allowed_mentions.replied_user = mention 
}
 let msg =  await axios.post(d.client._api(`channels/${d.channel.id}/messages`),
  data,{
     headers:{
         Authorization:`Bot ${d.client.token}`
         }
     }).catch(e=>d.error(e.message))

 return {
     code: code.replaceLast(`$apiMessage${inside}`,returnID === "no" ? "" : msg.data.id )
 }
}
