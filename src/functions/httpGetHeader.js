module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [name] = data.inside.splits;

    data.result = d.data.http?.headers[name.addBrackets()]

    return {
        code: d.util.setCode(data),
        data: d.data
    }
}