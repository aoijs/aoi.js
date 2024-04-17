module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [option] = data.inside.splits;

    data.result = d.data.timeoutData[option].deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
}