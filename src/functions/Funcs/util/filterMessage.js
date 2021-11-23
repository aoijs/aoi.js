module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [text, ...letters] = data.inside.splits;
    data.result = text;

    for (let i = letters.length - 1; i >= 0; i--) {
        data.result = data.result.split(letters[i]).join(" ")
    }

    return {
        code: d.util.setCode(data)
    }
} 