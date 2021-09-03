module.exports = async d =>{

const {code} = d.command

const inside = d.unpack() 

const err = d.inside(inside)

if(err) return d.error(err)

let [channelId,type="public",limit=10,fetchAll="yes",option="name"] = inside.splits; 

const channel = await d.util.getChannel(d,channelId)

if(!channel) return d.aoiError.fnError(d,"channel",{inside}) 

let data = await channel.thread.fetchArchived({type, fetchAll: fetchAll==="yes",limit})

data = data.threads.map(x=>x[option]).join(",")

return {

code: code.replaceLast(`$fetchActiveThread${inside}`,data)

}

}