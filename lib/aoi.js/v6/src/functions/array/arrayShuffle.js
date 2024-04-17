module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name] = data.inside.splits;

    if (!d.data.arrays?.[name]) {
        return d.aoiError.fnError( d, "custom", { inside: data.inside }, "Array with name '" + name + "' does not exist." );
    }
    
    const array = d.arrays[name];

    for (let i = array.length - 1; i > 0; i--) {
        const u = Math.floor(Math.random() * (i + 1));
        [array[i], array[u]] = [array[u], array[i]];
    }

    d.data.arrays = d.arrays;

    return {
        code: d.util.setCode(data),
        arrays: d.arrays,
        data: d.data,
    }
}
