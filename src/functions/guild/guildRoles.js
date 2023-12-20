module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [
        guildID = d.guild?.id,
        type = "name",
        sep = " , ",
        removeManagedRoles = "true",
        fetch = "false",
    ] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    if (fetch === " true") {
        guild.roles.fetch();
    }
    let cache;

    if (removeManagedRoles === "true")
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