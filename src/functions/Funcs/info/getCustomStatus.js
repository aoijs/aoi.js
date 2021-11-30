module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, guildId = d.guild?.id, type = 'state'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const user = await d.util.getMember(d.guild, userId);
    if (!user) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    const status = user.presence?.activities?.find(x => x.type === 'CUSTOM');
    data.result = status?.[type] || "none";

    return {
        code: d.util.setCode(data)
    }
}
