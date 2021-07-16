module.exports = async d => {
 const code = d.command.code 
 
 const inside = d.unpack()
 const err = d.inside(inside)

 if (err) return d.error(err)
 
 const [emojiID, name, ...roles] = inside.splits
 
 const emoji = d.message.guild.emojis.cache.get(emojiID) 
 
 if (!emoji) return d.error(`\`${d.func}: Invalid emoji ID in ${inside}\``)
 
 const e = await emoji.edit({
 name, 
 roles 
 }).catch(err => null) 
 
 if (!e) return d.error(`\`Failed to edit emoji\``)
 
 return {
 code: code.replaceLast(`$modifyEmoji${inside}`, "")
 }
}