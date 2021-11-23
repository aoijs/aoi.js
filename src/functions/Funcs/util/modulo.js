module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [...numbers] = data.inside.splits;

    if (numbers.some(x => isNaN(x))) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Number Provided In');
    if (numbers.length < 2) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, `At Least 2 Numbers Are Needed. Provided ${numbers.length} Numbers In`)

    data.result = numbers.length === 2 ? (numbers[0] % numbers[1]) : (numbers.reduce((a, b) => Number(a) % Number(b)));

    return {
        code: d.util.setCode(data)
    }
}