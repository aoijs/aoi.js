module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    let banned = guild.bans.cache.find(x => x.user.id = userId);
    if (!banned) banned = guild.bans.fetch(userId).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Get Ban Data With Reason: ' + e);
    });

    data.result = banned?.reason;

    return {
        code: d.util.setCode(data)
    }
}