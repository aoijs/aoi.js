module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji, guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = guild.emojis.cache.some(x => x.id === emoji || x.toString() === emoji || x.identifier.toLowerCase() === emoji.toLowerCase())

    return {
        code: d.util.setCode(data)
    }
}