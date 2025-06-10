/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = d.command.code;

    return {
        code: d.util.setCode(data)
    }
}