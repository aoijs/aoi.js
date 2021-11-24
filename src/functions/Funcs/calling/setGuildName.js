module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [name, guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    guild.setName(name.addBrackets()).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Set Guild Name With Reason: ' + err);
    });

    return {
        code: d.util.setCode(data)
    }
}