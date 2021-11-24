module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [time, text] = data.inside.splits;

    if (isNaN(time)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Number Provided In');

    data.result = text.repeat(Number(time));

    return {
        code: d.util.setCode(data)
    }
}