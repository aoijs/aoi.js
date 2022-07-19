module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userId = d.author?.id, guildID = d.guild?.id, returnUser = "no"] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, userId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    data.result = returnUser === "yes" ? member.displayName : member.nickname;

    return {
        code: d.util.setCode(data)
    }
}