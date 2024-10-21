/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [headerName, name = "res"] = data.inside.splits;

    if (!d.requests[name]) {
        return d.aoiError.fnError(d, "custom", {
            inside: data.inside
        }, `Invalid request name "${name}"!`)
    }

    if (!headerName) return d.aoiError.fnError(d, "custom", {
        inside: data.inside
    }, "Missing header name!");

    delete d.data.http?.headers[name];

    return {
        code: d.util.setCode(data),
        requests: d.requests
    }
}