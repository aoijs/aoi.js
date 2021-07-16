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

        if (!guild) return d.error(`\`${d.func}: Invalid guild ID in ${inside}\``)

        return {
            code: code.replaceLast(`$serverBanner${inside}`, guild.bannerURL({
                dynamic: dynamic === "yes",
                size: Number(size)
            }))
        }
    } else {
        return {
            code: code.replaceLast(`$serverBanner`, d.message.guild.bannerURL({ dynamic: true }))
        }
    }
}