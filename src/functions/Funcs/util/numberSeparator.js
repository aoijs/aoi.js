module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [number, sep = ','] = data.inside.splits;

    if (isNaN(number)) return d.aoiError.fnError(d, 'custom', {}, 'Invalid Number Provided In');

    const splits = number.split('.');

    data.result = Number(splits[0]).toLocaleString().replaceAll(",", sep.addBrackets())
    if (splits[1]) {
        data.result = data.result + '.' + splits[1];
    }

    return {
        code: d.util.setCode(data)
    }
}

