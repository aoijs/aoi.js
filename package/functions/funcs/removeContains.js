module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [channelID, amount, ...wordOrWords] = inside.splits
    
    const channel = d.client.channels.cache.get(channelID) 
    
    if (!channel) return d.error(`❌ Invalid channel ID in \`$removeContains${inside}\``) 
    
    const limit = Number(amount) 
    
    const messages = await channel.messages.fetch({
        limit
    }).catch(err => null) 
    
    if (!messages) return d.error(`❌ Failed to fetch messages `) 
    
    const m = await channel.bulkDelete(messages.filter(m => Date.now() - m.createdTimestamp < require("ms")("14d") && wordOrWords.some(word => (m.embeds && require("../../handlers/resolveEmbed")(m.embeds).includes(word.addBrackets())) || (m.content && m.content.toLowerCase().includes(word.addBrackets())))).map(m => m.id)).catch(err => null) 
    
    if (!m) return d.error(`❌ Failed to delete messages!`) 
    
    return {
        code: code.replaceLast(`$removeContains${inside}`, "")
    }
}