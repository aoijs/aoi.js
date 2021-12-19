module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});


    let banned = guild.bans.cache.get(userId);
    if (!banned) banned = await guild.bans.fetch(userId).catch(e => {
        undefined
    });

    data.result = !!banned;

    return {
        code: d.util.setCode(data)
    }
}