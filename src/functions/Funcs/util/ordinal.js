module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [number] = data.inside.splits;

    if (isNaN(number)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Invalid Number Provided In");

    if ([11, 12, 13].includes(Number(number))) {
        data.result = number + 'th'
    } else if ([1, 2, 3].some(x => number.endsWith(x.toString()))) {
        data.result = number.endsWith('1') ? number + 'st' : number.endsWith('2') ? number + 'nd' : number + 'rd';
    } else {
        data.result = number + 'th';
    }

    return {
        code: d.util.setCode(data)
    }
}