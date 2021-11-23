module.exports = async d => {
    const data = d.util.openFunc(d);

    const [guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = guild.bannerURL({dynamic: true, size: 4096});

    return {
        code: d.util.setCode(data)
    }
}