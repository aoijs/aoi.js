module.exports = async (d) => {
    const data = d.util.openFunc(d);

    const [sep = " , ", guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    data.result = guild.emojis.cache.map((x) => x.toString()).join(sep);

    return {
        code: d.util.setCode(data),
    };
};
