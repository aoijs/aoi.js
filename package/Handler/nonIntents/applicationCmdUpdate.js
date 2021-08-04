const Interpreter = require('../../interpreter.js')
module.exports = async (oa,na,client)=>{
const cmds = client.cmd.applicationCmdUpdate.array()
let chan;
    const data = {
        guild:na.guild,
        client:client
    }
    for(const cmd of cmds){
        if(cmd.channel?.includes("$")){
            const id = await Interpreter(client,data,[],{name:"ChannelParser",code:cmd.channel},client.db,true)
            chan = client.channels.cache.get(id)
        }
await Interpreter(client,data,[],cmd,client.db,false,chan?.id,{newapp:na,oldapp:oa},chan)
    }

}