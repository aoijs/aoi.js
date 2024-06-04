module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [roleID, guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = roleID.trim() === '' ? false : await guild.roles.fetch(roleID).catch(err => undefined);

    data.result = role ? true : false;

    return {
        code: d.util.setCode(data)
    }
}