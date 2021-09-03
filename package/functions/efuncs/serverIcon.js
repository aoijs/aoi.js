module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const options = [
            guildID = d.message.guild.id,
            size = 2048,
            dynamic = "yes"
        ] = inside.splits

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`:x: Invalid guild ID in \`$serverIcon${inside}\``)

        return {
            code: code.replaceLast(`$serverIcon${inside}`, guild.iconURL({
                dynamic: dynamic === "yes",
                size: Number(size)
            }))
        }
    } else {
        return {
            code: code.replaceLast(`$serverIcon`, d.message.guild.iconURL({ dynamic: true }))
        }
    }
}