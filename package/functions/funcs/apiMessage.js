const axios = require('axios')
const {EmbedParser, ComponentParser} = require('../../Handler/parsers.js')
module.exports = async d=>{
    const inside = d.unpack() 
    const code = d.command.code 
    const err = d.inside(inside)
    console.log(err)
    if(err) return d.error(err) 
    const [channel=d?.channel?.id,content,embed ="",components="",msgReply = "" ,returnID="no"] = inside.splits 
    if(!content  && embed === "") return d.error("$apiMessageError:Provide Either A Content Or A Embed Structure") 
   const e =embed !== "" ? await EmbedParser(embed||"") : []
   const c = components.length === 0? [] : await ComponentParser(components,d.client) 
if(!d?.client?.channels?.cache?.get(channel)) return d.error(`$apiMessageError:Invalid ChannelID Provided.`)  


const data = {  content: content||" " ,
     embeds: e,
     components: c,
     allowed_mentions : {parse:d.disabledMentions} 
}
if(msgReply !== ""){
       let [Reply,mention = false] = msgReply.split(":")

  data.message_reference= {message_id : Reply} 
    data.allowed_mentions.replied_user = mention?.replace("yes",true)?.replace("no",false)
}
 let msg =  await axios.post(d.client._api(`channels/${channel}/messages`),
  data,{
     headers:{
         Authorization:`Bot ${d.client.token}`
         }
     }).catch(e=>d.error(`$apiMessage:${e.message}`))

 return {
     code: code.replaceLast(`$apiMessage${inside}`,(returnID === "no" ? "" : msg?.data?.id)||"")
 }
}
