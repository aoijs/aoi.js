module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const name = data.inside.inside;

    data.result = d.arrays[name]?.length ?? 0;

    return {
        code: d.util.setCode(data),
    }
}