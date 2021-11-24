module.exports = async d => {
    const data = d.util.openFunc(d);

    const [guildId = d.guild?.id, type = 'name', sep = ' , ', fetch = 'no'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    if (fetch === ' yes') {
        guild.roles.fetch()
    }

    data.result = guild.roles.cache.map(x => type?.trim() === 'mention' ? x.toString() : x[type]).join(sep).removeBrackets();

    return {
        code: d.util.setCode(data)
    }
}