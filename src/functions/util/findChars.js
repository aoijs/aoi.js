module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let chars = data.inside.inside;
    data.result = chars.addBrackets().replace(/(\W|\d+)/g, "").deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
} 