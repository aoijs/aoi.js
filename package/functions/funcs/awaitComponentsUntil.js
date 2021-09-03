const AoiError = require('../../classes/AoiError.js')
const ms = require('ms')
module.exports = async (d)=> {
    const {code} = d.command 
    const inside = d.unpack() 
    const err = d.inside(inside)
    if(err) return d.error(err)
    let [channelId,messageId,userFilter,time,customIds,awaitCommands,data={}] = inside.splits 
    let chan = d.client.channels.cache.get(channelId) 
    if(!chan){
        chan = await d.client.channels.fetch(channelId).catch(e=>undefined) 
    }
    if(!chan) return d.error(`${d.func}: Invalid ChannelId Provided In ${inside}`)
    const msg = await chan.messages.fetch(messageId).catch(err=>undefined)
    if(!msg) return d.error(`${d.func}: Invalid MessageId Provided In ${inside}`)
    time = await ms(time) 
    if(!time) return d.error(`${d.func}: Invalid Time Provided In ${inside}`)
    customIds = customIds.split(',') 
    awaitCommands = awaitCommands.split(',') 
    awaitCommands.forEach(x=> {
if(d.client.cmd.awaited.find(y=>y.name.toLowerCase() === x.toLowerCase())){}
        else{ 
            return d.error(`${d.func}: Could Not Found AwaitedCommand:${x} `)
        } 
                     })
    try {
    data = JSON.parse(data) 
        }
    catch(err){
        return d.error(`${d.func}: Invalid Data Format Provided In ${inside}`)
    }
    const filter = (int) => (userFilter === "everyone" ? true : int.user.id === userFilter) && customIds.includes(int.customId) 
   msg.awaitMessageComponent({filter,time}).then(async int =>{
       const index = customIds.indexOf(int.customId) 
      const cmd = awaitCommands[index] 
      if(!cmd) return ; 
       await d.interpreter(d.client,{message:int.message,guild:int.guild,channel:int.channel,member:int.member,author:int.user,client:d.client},int.message?.content.split(" "),cmd,d.client.db,false, undefined,{interaction:int,awaitData:data})
   }).catch(err=>AoiError.consoleError(d.func,err))
    return {
        code:code.replaceLast(`awaitComponentsUntil${inside}`,"") 
    }
}