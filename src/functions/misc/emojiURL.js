/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [ emojiResolver ] = data.inside.splits;

    const emoji = await d.util.getEmoji(d, emojiResolver);

    if (!emoji) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid emoji");

    data.result = emoji.imageURL();

    return {
        code: d.util.setCode(data)
    };
}