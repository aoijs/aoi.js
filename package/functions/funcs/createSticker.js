const {MessageAttachment} = require('discord.js') 
module.exports = async d => {
const {code} = d.command
const inside = d.unpack()
const err = d.inside(inside) 
if(err) return d.error(err)
let [guildid,url,name,tags, description,reason] = inside.splits; 
const guild = d.client.guilds.cache.get(guildid) 
if(!guild) return d.aoiError.fnError(d,"guild",{inside})
const attachment = new MessageAttachment(url)
guild.stickers.create(attachment,name,tags,{description,reason})
return {
code: code.replaceLast(`$createSticker${inside}`,"")
}
}