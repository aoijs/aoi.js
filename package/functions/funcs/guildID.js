module.exports = async d => {

    const code = d.command.code

    const r = code.split("$guildID").length - 1

    const after = code.split("$guildID")[r].after()

    if (after.inside) {
        const name = after.inside

        const guild = d.client.guilds.cache.find(g => g.name === name.addBrackets())

        if (!guild) return d.error(`:x: Invalid guild name in \`$guildID${after}\``)

        return {
            code: code.replaceLast(`$guildID${after}`, guild.id)
        }
    } else {
        return {
            code: code.replaceLast(`$guildID`, d.message.guild ? d.message.guild.id : "")
        }
    }
}