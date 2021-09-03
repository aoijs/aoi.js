module.exports = async d => {
 const code = d.command.code 
 
 const inside = d.unpack()
 const err = d.inside(inside)

 if (err) return d.error(err)
 
 const str = inside.addBrackets() 
 
 const emote = d.client.emojis.cache.get(str.replace(/[^0-9]/g, "")) || d.client.emojis.cache.find(e => e.name === str) || "" 
 
 return {
 code: code.replaceLast(`$resolveEmojiID${inside}`, emote.id || "")
 }
}