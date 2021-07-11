module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()

    if (inside.inside) {
        const guild = d.client.guilds.cache.get(inside.inside)

        if (!guild) return d.error(`:x: Invalid guildID in \`$serverRulesChannelID${inside}\``)

        return {
            code: code.replaceLast(`$serverRulesChannelID${inside}`, guild.rulesChannelID.deleteBrackets())
        }
    } else {
        return {
            code: code.replaceLast(`$serverRulesChannelID`, d.message.guild.rulesChannelID.deleteBrackets())
        }
    }
}
