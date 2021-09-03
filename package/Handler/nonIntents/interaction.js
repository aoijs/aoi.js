const Interpreter = require('../../interpreter.js')
const {InteractionTypes, MessageComponentTypes} = require('../../Utils/InteractionConstants.js')
module.exports = async (interaction,client)=>{
    if(interaction.isMessageComponent()){
        client.interactionManager.emit("messageComponentInteraction", interaction)
    }
   // console.log(require('util').inspect(interaction,{depth:0}))
   let cmds;
    if(InteractionTypes[interaction.type] === "component"){
        cmds = client.cmd.interaction[MessageComponentTypes[interaction.componentType]].filter(x=>Array.isArray(x.name)?x.name.find(y=>y === interaction.customId):x.name === interaction.customId || true ).allValues()
      //  console.log(cmds)
    }
    else{
cmds =        client.cmd.interaction.slash.filter(x=>x.name.toLowerCase() === interaction.commandName.toLowerCase()).allValues()

    }
    if(!cmds.length) return ;
    const data = {
        client:client,
        guild: interaction.guild,
        message:interaction?.message,
        channel:interaction.channel,
        author:interaction.author,
        member:interaction.member
    }
    for(const cmd of cmds){
await Interpreter(client,data,[],cmd,client.db,false,undefined,{interaction:interaction},undefined)
    }

}