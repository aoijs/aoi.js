module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = [...guild.roles.cache.sort((a, b) => a.position - b.position)][1]?.[0];

    return {
        code: d.util.setCode(data)
    }
}