const {MessageAttachment} = require('discord.js') 

module.exports = async d => {

const {code} = d.command

const inside = d.unpack()

const err = d.inside(inside) 

if(err) return d.error(err)

let [guildid,name,reason] = inside.splits; 

const guild = d.client.guilds.cache.get(guildid) 

if(!guild) return d.aoiError.fnError(d,"guild",{inside})

const sticker = guild.stickers.cache.find(x=>x.name?.toLowerCase() === name.toLowerCase()) 
if(!sticker) return d.aoiError.fnError(d,"custom",{inside},"Invalid Sticker Provided In")

guild.stickers.delete(sticker,reason)

return {

code: code.replaceLast(`$deleteSticker${inside}`,"")

}

}