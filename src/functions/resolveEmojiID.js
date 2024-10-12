/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const emoji = data.inside.inside;

    data.result = (await d.util.getEmoji(d, emoji))?.id ?? null;

    return {
        code: d.util.setCode(data),
    };
};