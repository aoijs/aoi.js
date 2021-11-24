module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);
    const [roleId, newPosition, guildId = d.guild?.id] = data.inside.splits;
    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});
    const role = await guild.roles.fetch(roleId);
    if (!role) return d.aoiError.fnError(d, 'role', {inside: data.inside});

    await role.setPosition(newPosition).catch((err) => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, `Failed to change \`${role.name}\` position to \`${newPosition}\` with Reason: ${err}`);
    });

    return {
        code: d.util.setCode(data)
    }
}
//Usage: $setRolePosition[role id, new position, guild id(optional)]
