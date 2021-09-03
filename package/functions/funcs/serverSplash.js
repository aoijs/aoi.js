module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.insidee) {
        const options = [
            guildID = d.message.guild.id,
            size = 2048,
        ] = inside.splits

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`:x: Invalid guild ID in \`$serverSplash${inside}\``)

        return {
            code: code.replaceLast(`$serverSplash${inside}`, guild.splashURL({
                size: Number(size)
            }))
        }
    } else {
        return {
            code: code.replaceLast(`$serverSplash`, d.message.guild.splashURL({ dynamic: true }))
        }
    }
}