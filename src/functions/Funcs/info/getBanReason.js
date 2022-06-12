module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, userID = d.author?.id,] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    let banned = await guild.bans.fetch(userID).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Get Ban Data With Reason: ' + e);
    });

    data.result = banned?.reason;

    return {
        code: d.util.setCode(data)
    }
}