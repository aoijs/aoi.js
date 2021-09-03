const axios = require('axios')
const {EmbedParser, ComponentParser,FileParser} = require('../../Handler/parsers.js')
module.exports = async d=>{
    try{
    const inside = d.unpack() 
    const code = d.command.code 
    const err = d.inside(inside)
    if(err) return d.error(err) 
    const [channel=d.channel?.id,content=" ",embed ="",components="",attachments="",msgReply = "" ,returnID="no"] = inside.splits 
    if(!content  && embed === "") return d.error("$apiMessage:Provide Either A Content Or A Embed Structure") 
   const e =embed !== "" ? await EmbedParser(embed||"") : []
   const c = (components==="") ? [] : await ComponentParser(components,d.client) 
   const f = (attachments === "" ) ? [] : await FileParser(attachments);
       f.file = f.attachment 
if(!d?.client?.channels?.cache?.get(channel)) return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}))  
const data = {  content: content||" " ,
     embeds: e,
     components: c,
     allowed_mentions : {parse:d.disabledMentions} 
}
const files = f
if(msgReply !== ""){
       let [Reply,mention = false] = msgReply.split(":")

  data.message_reference= {message_id : Reply} 
    data.allowed_mentions.replied_user = mention?.replace("yes",true)?.replace("no",false)
}
 let msg =  await d.client.api.channels(d?.client?.channels?.cache?.get(channel)?.id).messages.post({
     data:data,
     files:files
}).catch(e=>d.error(`$apiMessage:${e.message}`))
 return {
     code: code.replaceLast(`$apiMessage${inside}`,(returnID === "no" ? "" : msg?.id)||"")
 }
        }
    catch(e){
        console.log(e)
    }
}