module.exports = d => {
    const code = d.command.code
    
    const inside = d.unpack();
    
    var guildId = inside.splits;

    const guild = d.client.guilds.cache.get(guildId) || d.client.guilds.cache.get(d.message.guild.id);

    if (!guild.emojis.cache.size) return { 
        code: code.replaceLast(`$randomEmoji${inside ? inside : ""}`, "")
    }

    const emoji = guild.emojis.cache.random()
    
    if (emoji.deleted) return { 
        code: code.replaceLast(`$randomEmoji${inside ? inside : ""}`, "")
    }

    return { 
        code: code.replaceLast(`$randomEmoji${inside ? inside : ""}`, `${emoji.toString()}`)
    }
}