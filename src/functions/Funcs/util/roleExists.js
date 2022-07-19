module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [roleId, guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = roleId.trim() === '' ? false : await guild.roles.fetch(roleId).catch(err => undefined);

    data.result = role ? true : false;

    return {
        code: d.util.setCode(data)
    }
}