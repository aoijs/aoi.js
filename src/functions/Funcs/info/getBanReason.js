module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id, guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    let banned = guild.bans.cache.find(x => x.user.id = userID);
    if (!banned) banned = guild.bans.fetch(userID).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Get Ban Data With Reason: ' + e);
    });

    data.result = banned?.reason;

    return {
        code: d.util.setCode(data)
    }
}