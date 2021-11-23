module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    const [text, limit = 2000] = inside.splits;

    const result = text.addBrackets().trim().slice(0, limit);

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}