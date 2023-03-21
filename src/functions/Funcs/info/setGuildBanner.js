module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, url, reason] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    try {
        await guild.setBanner(url, reason);
        data.result = "";
    } catch (err) {
        d.aoiError.fnError(d, "custom", {}, err.message)
    }

    return {
        code: d.util.setCode(data),
    };
}