module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, userId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    data.result = member.presence?.status || 'offline';

    return {
        code: d.util.setCode(data)
    }
}