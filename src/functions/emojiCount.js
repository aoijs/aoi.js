/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [guildID = d.guild?.id, type = "all", force = "false"] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    if (force === "true") {
        await guild.emojis.fetch();
    }

    data.result = type
        ? guild.emojis.cache.filter((x) =>
            type === "animated"
                ? x.animated
                : type === "roles"
                    ? x.roles.cache.size
                    : type === "normal"
                        ? !x.animated
                        : type === "all"
                            ? true
                            : x[type],
        ).size
        : guild.emojis.cache.size;
    return {
        code: d.util.setCode(data),
    };
};