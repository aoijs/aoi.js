module.exports = d => {
    const data = d.util.aoiFunc(d);

    let [from = 0, to = d.args.length] = data.inside.splits;

    from = Number(from);
    to = Number(to);

    if (isNaN(from) || isNaN(to)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Number Provided In');

    data.result = d.args.slice(from, to).join(' ');

    return {
        code: d.util.setCode(data)
    }
}