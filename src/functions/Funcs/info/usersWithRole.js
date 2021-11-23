module.exports = async d => {
    const data = d.util.openFunc(d);

    const [roleId, guildId = d.guild?.id, option = 'id', sep = ' , '] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = await guild.roles.fetch(roleId).catch(err => {
        d.aoiError.fnError(d, 'role', {inside: data.inside});
    });

    data.result = role.members.map(x => option === "mention" ? x.toString() : x[option]).join(sep)

    return {
        code: d.util.setCode(data)
    }
}