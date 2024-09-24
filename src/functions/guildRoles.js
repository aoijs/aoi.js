/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, type = "name", sep = " , ", removeManagedRoles = "true", fetch = "false"] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    if (fetch === "true" || !guild.roles.cache.size) {
        await guild.roles.fetch();
    }

    let cache;

    if (removeManagedRoles === "true") cache = guild.roles.cache.filter((x) => !x.managed);
    else cache = guild.roles.cache;

    const sort = cache.sort((a, b) => a.position - b.position);

    const result = sort
        .map((role) => {
            if (type.includes("{")) {
                return type.replaceAll(/{(.+?)}/g, (_, prop) => role[prop]);
            } else {
                return role[type];
            }
        })
        .join(sep)
        .removeBrackets();

    data.result = result;

    return {
        code: d.util.setCode(data)
    };
};