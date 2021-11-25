module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const sep = data.inside.inside;

    data.result = d.array.join(sep.addBrackets());

    return {
        code: d.util.setCode(data, false)
    }
}