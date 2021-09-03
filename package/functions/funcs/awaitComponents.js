const Interpreter = require("../../interpreter.js")
const {EmbedParser, ComponentParser,FileParser} = require('../../Handler/parsers.js')
module.exports = async d =>{ 
    const code = d.command.code 
    const inside = d.unpack() 
    const err = d.inside(inside) 
    if (err) return d.error(err) 
//----------------------------------------//
    let [messageID,userFilter,customIDs,cmds,errorMsg="",uses=1,data=""] = inside.splits
errorMsg =await d.util.errorParser(errorMsg) 
    if(data!==""){
    try {
   data = JSON.parse(data)
        }
    catch(e){
        d.aoiError.fnError(d,"custom",{inside},"Invalid Data Provided In") 
    }
        }
cmds = cmds.split(",") 
 cmds.forEach(x=>{
if(d.client.cmd.awaited.find(y=>y.name === x)){}
     else{d.error("$awaitComponents:Could not find awaitedCommand "+x)} 
     })
 customIDs = customIDs.split(",") 
  const emsg = {
      content:errorMsg.content,
      embeds:(!errorMsg.embeds || errorMsg.embeds === "")?[]:await EmbedParser(errorMsg.embeds||""),
      components:(!errorMsg.components || errorMsg.components === "")?[]:await ComponentParser(errorMsg.components||""),
      files:(!errorMsg.files || errorMsg.files=== "")?[]:await FileParser(errorMsg.files||"") 
  }
//---------------------------------------//
const Component = new d.client.interactionManager.awaitComponents({msgId:messageID,filter:userFilter,customIds:customIDs,cmds:cmds,errorMessage:emsg,uses:uses},d.client,data)
d.client.interactionManager.on("messageComponentInteraction",interact)
    Component.on("AwaitComponent",async interaction=>{
        const index = cmds[customIDs?.indexOf(interaction.customId)]
   const cmd = d.client.cmd.awaited.find(x=>x.name.toLowerCase() === index.toLowerCase())
   if(!cmd) return ;
        await Interpreter(d.client,interaction,interaction.message.content?.split(" "),cmd,d.client.db,false, undefined,{awaitData: Component.data, interaction})
    })
//--------------------------------------//
async function interact(interaction){
    if(Component.uses < Component.tries){
        d.client.interactionManager.removeListener("messageComponentInteraction",interact)
    }
    Component.await(interaction.message.id,interaction.user.id,interaction.customId,interaction)
}
    return {
        code:code.replaceLast(`$awaitComponents${inside}`,"")
    }
}
