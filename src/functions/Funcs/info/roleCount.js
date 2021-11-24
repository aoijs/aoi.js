module.exports = async d => {
    const data = d.util.openFunc(d);

    const [guildId = d.guild?.id, fetchFirst = 'no'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    if (fetchFirst === 'yes') {
        guild.roles.fetch();
    }

    data.result = guild.roles.cache.size;

    return {
        code: d.util.setCode(data)
    }
}