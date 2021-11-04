module.exports = d => {
    const data = d.util.openFunc(d);

    const [guildId = d.guild?.id, force = 'no', option = 'name', sep = ' , '] = data.inside.splits;

    const guild = d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', { inside: data.inside });

    if( force === 'yes' ) guild.bans.fetch();

    data.result = guild.bans.cache.map(x => option === 'mention' ? x.toString() : x[option]).join(sep);

    return {
        code: d.util.setCode(data)
    }
}