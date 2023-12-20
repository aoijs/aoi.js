module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, option = 'name', sep = ' , '] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = guild.channels.cache.map(x => option === 'mention' ? x.toString() : x[option]).join(sep);

    return {
        code: d.util.setCode(data)
    }
}