let axios = require('axios') 
module.exports = async d =>{
const code = d.command.code 
const inside = d.unpack()
const err = d.inside(inside)
if(err) return d.error(err) 
let [userID ,channelID = d.channel.id] = inside.splits ;
  let chan = d.client.channels.cache.get(channelID)   
if(!chan) return d.error(`Invalid ChannelID Provided in $removeThreadMember${inside}`);
    let user = chan.guild.members.cache.get(userID)
    if(!user) return d.error(`Invalid UserID Provided in $removeThreadMember${inside}`);
    try{
let req = await axios.delete(d.client._api(`channels/${chan.id}/thread-members/${user.id}`),{
headers:{
Authorization:`Bot ${d.client.token}`
}
})
return {
code:code.replaceLast(`$removeThreadMember${inside}`,"")
}
  }
    catch(err){
               d.error("Failed To Remove "+user.user.tag+ " From The Thread With Error Message :"+err.message)
              }
}
/*
function: $removeThreadMember
usage: $removehreadMember[userID;channelID (optional)]
description: removes the provided user from the thread
perms: `MANAGE_THREADS` required
*/
