/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [hex] = data.inside.splits;
    hex = hex.addBrackets().replace('#', '');

    data.result = !isNaN(parseInt(hex, 16));

    return {
        code: d.util.setCode(data)
    }
}
