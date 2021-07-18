module.exports = async d => {
 const code = d.command.code
 
 const inside = d.unpack()
 
 if (inside.inside) {
 const [channelID, type = "tag", separator = ", "] = inside.splits
 
 const channel = d.client.channels.cache.get(channelID) 
 
 if (!channel) return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``)
 
 const users = [] 
 
 for (const [_, value] of channel._typing) {
 users.push(type === "mention" ? value.user.toString() : value.user[type] || "")
 }
 return {
 code: code.replaceLast(`$usersTyping${inside}`, users.join(", ").deleteBrackets())
 }
 } else {
 const users = [] 
 
 for (const [_, value] of d.message.channel._typing) {
 users.push(value.user.tag)
 }
 return {
 code: code.replaceLast(`$usersTyping`, users.join(", ").deleteBrackets()) 
 }
 }
}