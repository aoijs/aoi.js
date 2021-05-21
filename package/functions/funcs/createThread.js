const fetch = require("node-fetch")
module.exports = async d => {
const code = d.command.code 
const inside = d.unpack()
const err = d.inside(inside)
if(err) return d.error(err)
let [name,auto_archive_time = 60, channel = d.channel.id , message = undefined ] = inside.splits 
if(name.length <2 || 100 < name.length) return d.error(`Name should be between 2- 100 Characters in $createThread${inside}`)
if(![60,1440,4320,10080]. includes (Number(auto_archive_time))) return d.error(`Invalid time provided. Current Available Auto Archive Time are \`60,1440,4320,10080\` `)
 const chan = d.guild.channels.cache.get(channel)
    if(!chan) return d.error(`Invalid ChannelID Provided in $createThread${inside}`) 
    if(!message){
  const body = {name:name,auto_archive_duration:auto_archive_time };
let data = await fetch(d.client._api(`channels/${chan.id}/threads`), {
 method: 'post',
body:    JSON.stringify(body),
  headers: { 'Content-Type': 'application/json' ,

Authorization:`Bot ${d.client.token}`}
})
data = await data.json()
        console.log(data)
  
        }
    else{
      const msg = await chan.messages.fetch(message) 
      if(!msg) return d.error(`Invalid MessageID Provided in \`$createThread${inside}\`. `)
        const body = {name:name,auto_archive_duration:auto_archive_time };

let data = await fetch(d.client._api(`channels/${chan.id}/messages/${msg.id}/threads`), {

 method: 'post',

body:    JSON.stringify(body),

  headers: { 'Content-Type': 'application/json' ,

Authorization:`Bot ${d.client.token}`}

})
data = await data.json()

        console.log(data)
        }
    return {
        code: code.replaceLast(`$createThread${inside}`,"")
        }
}

/*
Usage : $createThread[name;auto_archive_duration (optional);channelid (optional);MessageID(optional)]
description: creates a thread channel for current /provided channelid. If message id is not given , then it will create a channel with type `GUILD_PRIVATE_THREAD` else it will create a public thread depending on the parent channel (of the tread) type.
auto_archive_duration can only be set to `60,1440,4320,10080` as per given by Discord api 
name has a char limit of 2 to 100 

*/
