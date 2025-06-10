/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = d.message?.id;

    return {
        code: d.util.setCode(data)
    }
}