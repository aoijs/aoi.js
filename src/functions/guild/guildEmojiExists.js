module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji, guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = guild.emojis.cache.some(x => x.id === emoji || x.toString() === emoji || x.identifier.toLowerCase() === emoji.toLowerCase())

    return {
        code: d.util.setCode(data)
    }
}