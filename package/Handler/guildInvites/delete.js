const Interpreter = require('../../interpreter.js') 
module.exports = async (invite,client)=> {
const cmds = client.cmd.inviteDelete.allValues()
for(const cmd of cmds){
    let chan;
    const data = {
        guild:invite.guild,
        client:client
    }
    if(cmd.channel?.includes("$")){
        const id = await Interpreter(client,data,[],{name:"ChannelParser",code:cmd.channel},client.db,true)
        const channel = client.channels.cache.get(id?.code)
        chan = channel?? undefined
    }
       await Interpreter(client,data,[],cmd,client.db,false,chan?.id||"",{inviteData:invite},chan||undefined)
}
if(client.options.fetchInvites.enabled){
    client.inviteSystem.inviteDelete(invite)
}
}