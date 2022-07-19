module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID, userId, roleId] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});


    const member = await d.util.getMember(guild, userId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    member.roles.add(roleId).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Give Role With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}