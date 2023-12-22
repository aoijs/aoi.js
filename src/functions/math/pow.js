module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [number, power] = data.inside.splits;

    if (isNaN(number) || number.trim() === '') return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Number Provided In');
    if (isNaN(power) || power.trim() === '') return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Power Provided In');

    data.result = Math.pow(Number(number), Number(power));

    return {
        code: d.util.setCode(data)
    }
}
