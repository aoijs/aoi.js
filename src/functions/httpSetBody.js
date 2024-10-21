/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [body, name = "res"] = data.inside.splits;

    (d.requests[name] ??= {}).body = body;

    return {
        code: d.util.setCode(data),
        requests: d.requests
    }
}