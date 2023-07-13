module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name,separator = ","] = data.inside.splits;
    data.result = d.arrays[name].join(separator);

    return {
        code: d.util.setCode(data),
    }
}