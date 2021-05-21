let axios = require('axios') 
module.exports = async d =>{
const code = d.command.code 
const inside = d.unpack()
const err = d.inside(inside)
if(err) return d.error(err) 
let [userID ,channelID = d.channel.id] = inside.splits ;
  let chan = d.client.channels.cache.get(channelID)   
if(!chan) return d.error(`Invalid ChannelID Provided in $addThreadMember${inside}`);
    let user = chan.guild.members.cache.get(userID)
    if(!user) return d.error(`Invalid UserID Provided in $addThreadMember${inside}`);
    try{
let req = await axios.put(d.client._api(`channels/${chan.id}/thread-members/${user.id}`),{
headers:{
Authorization:`Bot ${d.client.token}`
}
})
return {
code:code.replaceLast(`$addThreadMember${inside}`,"")
}
  }
    catch(err){
               d.error("Failed To Add "+user.user.tag+ " To The Thread With Error Message :"+err.message)
              }
}
/*
function: $addThreadMember
usage: $addThreadMember[userID;channelID (optional)]
description: adds the provided user to the thread
*/
