module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, ...words] = data.inside.splits;

    data.result = text.addBrackets();

    words.forEach(x => {
        data.result = data.result.replaceAll(x, '');
    });

    return {
        code: d.util.setCode(data)
    }
}