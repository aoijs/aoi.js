module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [sep = ' ', name = 'main'] = data.inside.inside;

    data.result = d.array[name].join(sep.addBrackets());

    return {
        code: d.util.setCode(data, false)
    }
}