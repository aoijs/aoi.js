module.exports = async d => {
    const data = d.util.openFunc(d);

    if (data.err) return d.error(data.err);

    const [userId = d.member?.id, guildId = d.guild?.id] = data.inside.splits;
    const guild = await d.util.getGuild(d, guildId);

    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});
    const user = await d.util.getMember(guild, userId)

    if (!user) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    data.result = user.voice.selfMute
    return {
        code: d.util.setCode(data)
    }
}