module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const name = data.inside.inside;

    if (!d.data.arrays?.[name]) {
        return d.aoiError.fnError( d, "custom", { inside: data.inside }, "Array with name '" + name + "' does not exist." );
    }

    data.result = d.arrays[name]?.length ?? 0;

    return {
        code: d.util.setCode(data),
    }
}