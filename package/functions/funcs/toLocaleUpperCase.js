module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [text] = data.inside.splits;

    data.result = text.addBrackets().slice(0, 1).toUpperCase() + text.addBrackets().slice(1).toLowerCase();

    return {
        code: d.util.setCode(data)
    }
}