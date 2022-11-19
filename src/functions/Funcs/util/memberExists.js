module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [userID, guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'custom', {inside: data.inside});

    data.result = userID.trim() === '' ? false : await d.util.getMember(guild, userID) ? true : false;

    return {
        code: d.util.setCode(data)
    }
}