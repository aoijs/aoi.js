/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [emoji] = data.inside.splits;
    emoji = await d.util.getEmoji(d, emoji);
    if (!emoji) return d.aoiError.fnError(d, "emoji", { inside: data.inside });

    emoji.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Emoji: " + emoji.name + " With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    }
}