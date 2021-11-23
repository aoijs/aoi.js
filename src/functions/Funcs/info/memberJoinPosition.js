module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'custom', {inside: data.inside});

    data.result = [...guild.members.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).values()].findIndex(x => x.id === userId) + 1;

    return {
        code: d.util.setCode(data)
    }
}
