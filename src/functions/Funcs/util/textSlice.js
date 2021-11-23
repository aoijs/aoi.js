module.exports = d => {
    const data = d.util.openFunc(d);

    let [text, from = 0, to] = data.inside.splits;

    from = Number(from);
    to = Number(to);

    if (isNaN(from) || isNaN(to)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Number Provided In');

    data.result = text.split(' ').slice(from, to).join(' ');

    return {
        code: d.util.setCode(data)
    }
}