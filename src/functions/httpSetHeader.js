module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [name, value] = data.inside.splits;

    ((d.data.http ??= {})["headers"] ??= {})[name] = value;

    return {
        code: d.util.setCode(data),
        data: d.data
    }
}