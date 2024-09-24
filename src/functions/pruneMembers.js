/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [days = 7, guildID = d.guild?.id, roleIds, dry = 'false', reason, count = 'false'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});


    if (roleIds && roleIds?.split(',').some(x => !guild.roles.cache.get(x.trim()))) {
        d.aoiError.fnError(d, 'role', {inside: data.inside});
    }

    data.result = await guild.members.prune({
        days: Number(days),
        count: count === 'true',
        dry: dry === 'true',
        roles: roleIds.split(',').map(x => x.trim()),
        reason: reason?.addBrackets(),
    }).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Prune Members With Reason: ' + err);
    });

    return {
        code: d.util.setCode(data)
    }
}