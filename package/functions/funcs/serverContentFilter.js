module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()
     
    if (inside.inside) {
        const guildID = inside.inside

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`\`${d.func}: Invalid guild ID in ${inside}\``)

        return {
            code: code.replaceLast(`$serverContentFilter${inside}`, guild.explicitContentFilter.split("_").map(word => word.toLowerCase().replace(word.toLowerCase()[0], word[0])).join(" "))
        }
    } else {
        return {
            code: code.replaceLast(`$serverContentFilter`, d.message.guild.explicitContentFilter.split("_").map(word => word.toLowerCase().replace(word.toLowerCase()[0], word[0])).join(" "))
        }
    }
}