module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, limit = 2000, start = 0, char = ""] = data.inside.splits;

    const result = text.addBrackets().trim().split(char).slice(Number(start), Number(limit)).join(char);

    data.result = result;

    return {
        code: d.util.setCode(data)
    }
}