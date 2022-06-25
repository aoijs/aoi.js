module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [
        guildID = d.guild?.id,
        type = "name",
        sep = " , ",
        removeManagedRoles = "yes",
        fetch = "no",
    ] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    if (fetch === " yes") {
        guild.roles.fetch();
    }
    let cache;

    if (removeManagedRoles === "yes")
        cache = guild.roles.cache.filter((x) => !x.managed);
    else cache = guild.roles.cache;

    data.result = cache.map((x) =>
        type?.trim() === "mention" ? x.toString() : x[type],
    )
        .join(sep)
        .removeBrackets();

    return {
        code: d.util.setCode(data),
    };
};