module.exports = d => {
    const data = d.util.aoiFunc(d);

    let [text, sep = ' ', name = 'main'] = data.inside.splits;
    if (!name) return d.aoiError.fnError(d, 'custom', { inside: data.inside }, 'Invalid Name Provided In');

    d.array[name] = text.addBrackets().split(sep.addBrackets());
    d.data.array = d.array;

    return {
        code: d.util.setCode(data),
        data: d.data,
        array: d.array,
    }
}