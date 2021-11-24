module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [index] = data.inside.splits;

    if (isNaN(index) || Number(index) < 1) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Index Provided In');

    data.result = d.array[Number(index) - 1];

    return {
        code: d.util.setCode(data)
    }
}