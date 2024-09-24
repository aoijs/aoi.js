/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, presence = "", countBot = "true"] =
        data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});
    if (presence === "" && countBot === "true") data.result = guild.memberCount;
    else if (presence === "offline") {
        const mems = guild.members.cache.filter(
            (x) =>
                (x.presence?.status?.toLowerCase() === "offline" ||
                    !x.presence?.status) &&
                (countBot === "true" ? true : !x.user.bot),
        );
        data.result = mems.size;
    } else {
        const mems = guild.members.cache.filter(
            (x) =>
                (presence === "" || presence === "all"
                    ? true
                    : x.presence?.status?.toLowerCase() === presence.toLowerCase()) &&
                (countBot === "true" ? true : !x.user.bot),
        );

        data.result = mems.size;
    }
    return {
        code: d.util.setCode(data),
    };
};
