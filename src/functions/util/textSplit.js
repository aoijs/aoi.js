module.exports = d => {
    const data = d.util.aoiFunc(d);

    let [text, sep = ' '] = data.inside.splits;

    d.array = text.addBrackets().split(sep.addBrackets());
    d.data.array = d.array;

    return {
        code: d.util.setCode(data),
        data: d.data,
        array: d.array,
    }
}
