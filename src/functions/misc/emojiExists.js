/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji] = data.inside.splits;

    const emojiString = await d.util.getEmoji(d, emoji.addBrackets());

    data.result = !!emojiString;

    return {
        code: d.util.setCode(data)
    };
};
