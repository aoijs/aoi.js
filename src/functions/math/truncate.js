module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [number] = data.inside.splits;

    if (isNaN(number)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Number Provided In');

    data.result = Math.trunc(Number(number));

    return {
        code: d.util.setCode(data)
    }
}