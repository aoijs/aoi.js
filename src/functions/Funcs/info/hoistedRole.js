module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id, guildID = d.guild?.id, option = 'id'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, userID);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    const roles = member.roles.cache.sort((a, b) => b.position - a.position);

    data.result = option === "mention" ? roles.first().toString() : roles.first()[option];

    return {
        code: d.util.setCode(data)
    }
}