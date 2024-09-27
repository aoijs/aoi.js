/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const name = data.inside.splits[0] || "res";

    if (!d.requests[name]) {
        return d.aoiError.fnError(d, "custom", {
            inside: data.inside
        }, `Invalid request name "${name}"!`)
    }

    data.result = d.requests[name].redirected;

    return {
        code: d.util.setCode(data),
        requests: d.requests
    }
}