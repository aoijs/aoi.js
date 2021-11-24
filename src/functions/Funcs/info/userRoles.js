module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, guildId = d.guild?.id, option = 'name', sep = ' , '] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, userId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    data.result = member.roles.cache.map(x => option === 'mention' ? x.toString() : x[option.addBrackets()]).join(sep.addBrackets());

    return {
        code: d.util.setCode(data)
    }
}