/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [ content ] = data.inside.splits;

    return { 
        code: d.util.setCode(data),
    }
}