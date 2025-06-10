/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji] = data.inside.splits;

    data.result = d.util.isUnicodeEmoji(emoji);

    return {
        code: d.util.setCode(data)
    };
};
