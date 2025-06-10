/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = Math.abs(Date.now() - d.data.interaction?.createdTimestamp);
    
    return {
        code: d.util.setCode(data)
    }
}