module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name] = data.inside.splits;
    d.arrays[name] = d.util.shuffleArray(d.arrays[name]);
    d.data.arrays = d.arrays;

    return {
        code: d.util.setCode(data),
        arrays: d.arrays,
        data: d.data,
    }
}