/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [...text] = data.inside.splits;
    text = text.map(x => x.addBrackets());
    d.array.concat(text)

    return {
        code: d.util.setCode(data),
        data: {
            array: d.array
        }
    }
} 