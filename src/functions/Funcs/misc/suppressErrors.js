module.exports = d => {
    const data = d.util.openFunc(d);

    const [text = ' '] = data.inside.splits;

    return {
        code: d.util.setCode(data),
        suppressErrors: text.addBrackets()
    }
}
