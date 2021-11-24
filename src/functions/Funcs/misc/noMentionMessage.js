module.exports = d => {
    const data = d.util.openFunc(d);

    let [arg = '0'] = data.inside.splits;

    arg = Number(arg) - 1;
    if (isNaN(arg)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Invalid Number Provided In");

    const args = d.args.join(" ").replace(/(<#(\d{17,19})>|<@!?(\d{17,19})>|<@&(\d{17,19})>)/g, "").trim().split(/ +/g)

    data.result = arg === -1 ? args.join(" ") : args[arg];

    return {
        code: d.util.setCode(data)
    }
}