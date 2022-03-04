module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    const [text, limit = 2000,start = 0,char = ""] = inside.splits;

    const result = text.addBrackets().trim().split(char).slice(Number(start), Number(limit)).join(char);

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}