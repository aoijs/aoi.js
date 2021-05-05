module.exports = d => {
    const code = d.command.code;

    const inside = d.unpack();

    if (inside.inside) {
        const guildID = inside.inside;

        const guild = d.client.guilds.cache.get(guildID);

        if (!guildID) return d.error(`Invalid Guild ID at \`${inside}\``)

        return {
            code: code.replaceLast(`$isVerified${inside}`, guild.verified)
        }
    } else {
        return {
            code: code.replaceLast(`$isVerified`, d.message.guild.verified)
        }
    }
}