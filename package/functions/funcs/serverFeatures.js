module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const [
            guildID,
            separator = ", "
        ] = inside.splits

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`:x: Invalid guild ID in \`$serverFeatures${inside}\``)

        return {
            code: code.replaceLast(`$serverFeatures${inside}`, guild.features.map(feature => feature.split("_").map(word => word.toLowerCase().replace(word.toLowerCase()[0], word[0])).join(" ")).join(separator))
        }
    } else {
        return {
            code: code.replaceLast(`$serverFeatures`, d.message.guild.features.map(feature => feature.split("_").map(word => word.toLowerCase().replace(word.toLowerCase()[0], word[0])).join(" ")).join(", "))
        }
    }
}