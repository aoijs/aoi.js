module.exports = async d => {
    const code = d.command.code
    
    const r = code.split("$getReactions").length - 1
    
    const inside = code.split("$getReactions")[r].after()

    const err = d.inside(inside);

    if (err) return d.error(err);
    
    const [channelID, messageID, reaction, options = "username"] = inside.splits
    
    const channel = d.client.channels.cache.get(channelID)
    
    if (!channel) return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``)
        
    const msg = await channel.messages.fetch(messageID).catch(err => {})
    
    if (!msg) return d.error(`\`${d.func}: Invalid message ID in ${inside}\``)
        
    const emoji = reaction.addBrackets().includes("<") ? reaction.addBrackets().split(":")[2].split(">")[0] : reaction 
        
    const reactions = msg.reactions.cache.get(emoji) 
        
    if (reactions) {
        await reactions.users.fetch()
    }
    
    return {
        code: code.replaceLast(`$getReactions${inside}`, reactions ? reactions.users.cache.map(u => options === "mention" ? u.toString() : u[options.toLowerCase()]) : "none")
    }
} 