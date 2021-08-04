module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()

    if (inside.inside) {
        const guild = d.client.guilds.cache.get(inside.inside)

        if (!guild) return d.error(`\`${d.func}: Invalid guild ID in ${inside}\``)

        return {
            code: code.replaceLast(`$rulesChannelID${inside}`, guild.rulesChannelID.deleteBrackets())
        }
    } else {
        return {
            code: code.replaceLast(`$rulesChannelID`, d.message.guild.rulesChannelID.deleteBrackets())
        }
    }
}
