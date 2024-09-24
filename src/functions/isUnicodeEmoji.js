/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji] = data.inside.splits;

    const regex = /\p{Extended_Pictographic}/gu;
    data.result = regex.test(emoji);

    return {
        code: d.util.setCode(data)
    };
};
