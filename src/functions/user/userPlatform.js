module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id, guildID = d.guild?.id, sep = ' , '] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, userID);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    data.result = member.presence?.status === 'offline' ? 'none' : Object.keys(member.presence?.clientStatus || {none: "none"});

    return {
        code: d.util.setCode(data)
    }
}
