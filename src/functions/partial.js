/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    let {code, result} = d.util.aoiFunc(d);

    result = d.message?.partial;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}