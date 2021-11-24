module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [text, check] = data.inside.splits;

    data.result = text.addBrackets().endsWith(check.addBrackets());

    return {
        code: d.util.setCode(data)
    }
}