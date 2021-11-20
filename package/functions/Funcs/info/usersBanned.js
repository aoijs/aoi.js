module.exports = async d => {
    const data = d.util.openFunc(d);

    const [guildId = d.guild?.id, force = 'no', option = 'name', sep = ' , '] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    if (force === 'yes') await guild.bans.fetch();

    data.result = guild.bans.cache.map(x => option === 'mention' ? x.user.toString() : x.user[option]).join(sep);

    return {
        code: d.util.setCode(data)
    }
}
