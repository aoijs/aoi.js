module.exports = d => {
    const data = d.util.aoiFunc(d);

    const [text, type = 'encode'] = data.inside.splits;

    data.result = type === 'encode' ? encodeURIComponent(text.addBrackets()) : decodeURIComponent(text.addBrackets());

    return {
        code: d.util.setCode(data)
    }
}