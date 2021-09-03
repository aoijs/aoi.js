module.exports = async d => {

    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const guild = d.client.guilds.cache.get(inside.inside)

        if (!guild) return d.error(`:x: Invalid guild ID in \`$ownerID${inside}\``)

        return {
            code: code.replaceLast(`$ownerID${inside}`, guild.ownerID)
        }
    } else {
        return {
            code: d.command.code.replaceLast(`$ownerID`, d.message.guild.ownerID)
        }
    }
}