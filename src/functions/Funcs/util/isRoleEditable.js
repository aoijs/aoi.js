module.exports = async d => {
    const data = d.util.aoiFunc(d)
    if (data.err) return d.error(data.err);
    const [roleId, guildID = d.guild?.id] = data.inside.splits;
    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});
    const role = await guild.roles.fetch(roleId);
    if (!role) return d.aoiError.fnError(d, 'role', {inside: data.inside});
    data.result = role.editable
    return {
        code: d.util.setCode(data)
    }
}
//Usage: $isRoleEditable[role id;guild id(optional)]
