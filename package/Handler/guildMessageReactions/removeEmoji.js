
const Interpreter = require('../../interpreter.js')
module.exports = async (reaction,client)=>{
const cmds = client.cmd.reactionRemoveEmoji.allValues()
const data = {
    message : reaction.message,
    channel : reaction.message.channel,
    client:client,
    guild:reaction.emoji.guild
}
for(const cmd of cmds){
    let chan;
    if(cmd.channel?.includes("$")){
        const id = await Interpreter(client,data,[],{name:"ChannelParser",code:cmd.channel},client.db,true)
        chan = client.channels?.cache.get(id?.code)
    }
    await Interpreter(client,data,[],cmd,client.db,false,chan?.id,{reactionData:reaction },chan)
}
}