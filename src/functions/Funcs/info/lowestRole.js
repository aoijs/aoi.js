module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userId = d.author?.id, guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, userId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});
    const role = [...member.roles.cache.sort((a, b) => a.position - b.position)][1];

    data.result = role[0];

    return {
        code: d.util.setCode(data)
    }
}