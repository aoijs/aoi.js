const Interpreter = require('../../interpreter.js') 
module.exports = async (op,np,client)=> {
const cmds = client.cmd.presenceUpdate.array()
for(const cmd of cmds){
    let chan;
    const data = {
        guild:np.guild,
        client:client,
        author:np.user,
        member:np.member
    }
    if(cmd.channel?.includes("$")){
        const id = await Interpreter(client,data,[],{name:"ChannelParser",code:cmd.channel},client.db,true)
        const channel = client.channels.cache.get(id)
        chan = channel?? undefined
    }
       await Interpreter(client,data,[],cmd,client.db,false,chan?.id||"",{oldPresence:op,newPresence:np},chan||undefined)
}
}