module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild.id, type = "all"] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    data.result =
        type === "all"
            ? guild.channels.cache.size
            : guild.channels.cache.filter((x) =>
                type === "NSFW" ? x.nsfw === true : x.type === d.util.channelTypes[type],
            ).size;

    return {
        code: d.util.setCode(data),
    };
};
