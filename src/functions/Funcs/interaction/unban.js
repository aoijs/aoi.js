module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID = d.guild?.id, userID, reason] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    guild.members.unban(userID, reason).catch((err) => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Unban With Reason: ' + err)
    });

    return {
        code: d.util.setCode(data)
    };
};
