

module.exports = async d => {
const {code} = d.command 
const inside = d.unpack() 
const err = d.inside(inside) 
if(err) return d.error(err)
   let [name ,archive="MAX",type="public", startMessage]= inside.splits; 
   type = d.util.threadTypes[type] 
    if(!type) return d.aoiError.fnError(d,"custom",{inside},"Invalid Type Provided In") 
    if(!["60","1440","4320","10080","MAX"].includes(archive.toUpperCase())) d.aoiError.fnError(d,"custom",{inside},"Invalid Archive Duration Provided In") 
 d.channel.threads.create({name,autoArchiveDuration: archive,type,startMessage})
    return {
        code: code.replaceLast(`$createThread${inside}`,"")
    }
}