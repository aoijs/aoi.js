/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text] = data.inside.splits;

    data.result = text.addBrackets().replace(/\D/g, "");

    return {
        code: d.util.setCode(data)
    }
} 