/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = d.client.ws.ping;

    return {
        code: d.util.setCode(data)
    }
} 