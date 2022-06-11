module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [number, decimalPosition] = data.inside.splits;

    if (isNaN(number) || number.trim() === '') return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Number Provided In');
    if (isNaN(decimalPosition) || decimalPosition.trim() === '') return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Decimal Position Provided In');

    data.result = Number(number).toFixed(Number(decimalPosition));

    return {
        code: d.util.setCode(data)
    }
}