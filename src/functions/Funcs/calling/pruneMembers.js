module.exports = async d => {
    const data = d.util.openFunc(d);

    const [days = 7, guildId = d.guild?.id, roleIds, dry = 'no', reason, count = 'no'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});


    if (roleIds && roleIds?.split(',').some(x => !guild.roles.cache.get(x.trim()))) {
        d.aoiError.fnError(d, 'role', {inside: data.inside});
    }

    data.result = await guild.members.prune({
        days: Number(days),
        count: count === 'yes',
        dry: dry === 'yes',
        roles: roleIds.split(',').map(x => x.trim()),
        reason: reason?.addBrackets(),
    }).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Prune Members With Reason: ' + err);
    });

    return {
        code: d.util.setCode(data)
    }
}