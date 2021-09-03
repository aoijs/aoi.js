
module.exports = async d => {

const {code} = d.command

const inside = d.unpack()

const err = d.inside(inside) 

if(err) return d.error(err)

let [stageid,topic, privacy="GUILD_ONLY"] = inside.splits; 

const stage = d.guild.channels.cache.get(stageid) 

if(!stage) return d.aoiError.fnError(d,"custom",{inside},"Invalid Stage id Provided In")
stage.createStageInstance({topic,privacyLevel: privacy.toUpperCase()}) 
return {

code: code.replaceLast(`$createStageInstance${inside}`,"")

}

}