module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    let [guildId, type] = inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

    const result = type
        ? guild.emojis.cache.filter((x) => type === "animated" ? x.animated : type === "normal" ? !x.animated : type === "all" ? true : x[type]).size
        : guild.emojis.cache.size;
    return {
        code: d.util.setCode({function: d.func, code, inside, result}),
    };
};
