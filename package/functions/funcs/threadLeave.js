let axios = require('axios') 
module.exports = async d =>{
const code = d.command.code 
const inside = d.unpack()
let [channelID = d.channel.id] = inside.splits ;
  let chan = d.client.channels.cache.get(channelID)   
if(!chan) return d.error(`Invalid ChannelID Provided in ${inside.splits ? `$threadJoin${inside}` : `$threadJoin`}.`);
    try{
let req = await axios.delete(d.client._api(`channels/${chan.id}/thread-members/@me`),{
headers:{
Authorization:`Bot ${d.client.token}`
}
})
return {
code:code.replaceLast(inside.splits ? `$threadJoin${inside}` : "$threadJoin", "")
}
  }
    catch(err){
               d.error("Failed To Leave The Thread With Error Message :"+err.message)
              }
}
/*
function: $threadLeave
Usage : $threadLeave or $threadLeave[channelid] 
description: make the bot Leaves  the thread of the current/provided channel 
*/
