/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID, id] = data.inside.splits;
    const guild = guildID === "global" ? undefined : await d.util.getGuild(d, guildID);
    if (!guild && !["global"].includes(guildID)) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    d.client.application.commands.delete(id, guildID === 'global' ? undefined : guildID).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Application Command With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    }
} 