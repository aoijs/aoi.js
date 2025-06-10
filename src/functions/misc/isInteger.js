/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [number] = data.inside.splits;

    if (isNaN(number)) {
        data.result = false;
    } else {
        number = Number(number);
        data.result = Number.isInteger(number);
    }
    
    return {
        code: d.util.setCode(data)
    };
};
