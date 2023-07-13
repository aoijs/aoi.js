module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [guildID = d.guild?.id, roleID, icon] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = await guild.roles.fetch(roleID);
    if (!role) return d.aoiError.fnError(d, 'role', {inside: data.inside});

    await role.setIcon(icon.addBrackets()).catch(err => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, `Failed to change \`${role.name}\` icon to \`${icon}\` with Reason: ${err}`);
    });

    return {
        code: d.util.setCode(data)
    }
}