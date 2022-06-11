module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [number] = data.inside.splits;

    data.result = number.trim() === '' ? false : isNaN(number) ? false : true;

    return {
        code: d.util.setCode(data)
    }
}