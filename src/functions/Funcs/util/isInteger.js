module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [number] = data.inside.splits;

    data.result = number.trim() === '' ? false : Number.isInteger(number);

    return {
        code: d.util.setCode(data)
    }
}