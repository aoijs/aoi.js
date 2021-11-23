module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    data.result = data.inside.addBrackets().replace(/(\W|\d+)/g, "").deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
} 