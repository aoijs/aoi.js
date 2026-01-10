/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = d.client.application?.approximateUserAuthorizationCount || 0;

    return {
        code: d.util.setCode(data)
    }
}