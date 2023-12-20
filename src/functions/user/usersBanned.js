module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, force = 'false', option = 'id', sep = ' , '] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    if (force === 'true') await guild.bans.fetch();

    data.result = guild.bans.cache.map(x => option === 'mention' ? x.user.toString() : x.user[option]).join(sep);

    return {
        code: d.util.setCode(data)
    }
}
