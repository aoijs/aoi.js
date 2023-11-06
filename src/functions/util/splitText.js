module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, index] = data.inside.splits;

    if (isNaN(index) || Number(index) < 1) return d.aoiError.fnError(d, 'custom', { inside: data.inside }, 'Invalid Index Provided In');
    if (!name) return d.aoiError.fnError(d, 'custom', { inside: data.inside }, 'Invalid Name Provided In');

    data.result = d.array[name][Number(index) - 1];

    return {
        code: d.util.setCode(data)
    }
}