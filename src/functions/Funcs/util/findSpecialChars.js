module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [text] = data.inside.splits;

    data.result = text.addBrackets().replace(/(\w+)/g, "").deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
} 