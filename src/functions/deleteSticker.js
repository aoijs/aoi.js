/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID, sticker] = data.inside.splits;
    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    sticker = await d.util.getSticker(d.guild, sticker);
    if (!sticker) return d.aoiError.fnError(d, "sticker", { inside: data.inside });

    sticker.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Sticker: " + sticker.name + " With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    }
}