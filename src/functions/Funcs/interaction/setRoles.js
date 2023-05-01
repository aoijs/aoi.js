module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID, memberId, ...roleIds] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, memberId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    member.roles.set(roleIds).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Set Roles With Reason: ' + err);
    });

    return {
        code: d.util.setCode(data)
    }
}