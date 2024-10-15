/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [headerName, headerValue, name = "res"] = data.inside.splits;

    ((d.requests[name] ??= {})["headers"] ??= {})[headerName] = headerValue;

    return {
        code: d.util.setCode(data),
        requests: d.requests
    }
}