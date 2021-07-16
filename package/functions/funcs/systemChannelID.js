module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const guildID = inside.inside

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`\`${d.func}: Invalid guild ID in ${inside}\``)

        return {
            code: code.replaceLast(`$systemChannelID${inside}`, guild.systemChannelID || "")
        }
    } else {
        return {
            code: code.replaceLast(`$systemChannelID`, d.message.guild.systemChannelID || "")
        }
    }
}