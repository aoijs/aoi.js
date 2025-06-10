/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const sticker = data.inside.inside;

    data.result = (await d.util.getSticker(d, sticker))?.id ?? "";

    return {
        code: d.util.setCode(data),
    };
};