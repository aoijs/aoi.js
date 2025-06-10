/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [ guildId ] = data.inside.splits;

    if (!guildId) return d.aoiError.fnError(d, "guild", { inside: data.inside })
    
    const guild = await d.util.getGuild(d, guildId);

    guild.delete().catch((err) => d.aoiError.fnError(d, "custom", {}, "Failed to delete guild with Reason: " + err));

    return {
        code: d.util.setCode(data)
    }
}