module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [avatar, guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    guild.setIcon(avatar.addBrackets()).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Set Guild Icon With Reason: ' + err);
    });

    return {
        code: d.util.setCode(data)
    }
}