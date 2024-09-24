/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, ...characters] = data.inside.splits;

    data.result = characters.some(x => text.deleteBrackets().includes(x.deleteBrackets()));

    return {
        code: d.util.setCode(data)
    }
}