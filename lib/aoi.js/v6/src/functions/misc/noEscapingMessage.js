module.exports = d => {
    const data = d.util.aoiFunc(d);

    let [arg = '0'] = data.inside.splits;

    arg = Number(arg) - 1;
    if (isNaN(arg)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Invalid Number Provided In");

    data.result = arg === -1 ? d.args.join(" ") : d.args[arg];

    return {
        code: d.util.setCode(data, false)
    }
}