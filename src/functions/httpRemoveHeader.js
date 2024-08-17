module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [name] = data.inside.splits;
    if (!name) return d.aoiError.fnError(d, "custom", {
        inside: data.inside
    }, "Missing header name!");

    delete d.data.http?.headers[name];

    return {
        code: d.util.setCode(data),
        data: d.data
    }
}