module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [guildId, userId, ...roles] = data.inside.splits;

    roles = roles.map(x => x.toLowerCase());

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    const member = await d.util.getMember(guild, userId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    const memRoles = member.roles.cache

    data.result = roles.some(x => memRoles.has(x) || memRoles.find(y => y.name.toLowerCase() === x));

    return {
        code: d.util.setCode(data)
    }
}
