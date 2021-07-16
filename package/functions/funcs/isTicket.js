module.exports = async d => {
 const code =d.command.code 
 
 const anything = d.unpack() 
 
 const channel = anything.inside ? d.message.guild.channels.cache.get(anything.inside) : d.message.channel 
 
 if (!channel) return d.error(`\`${d.func}: Invalid channel ID in ${anything.total}\``)
 
 const exists = await d.client.db.get("main", `ticket_${channel.id}`)
 
 return {
 code: code.replaceLast(`$isTicket${anything.total}`, new Boolean(exists)) 
 }
}