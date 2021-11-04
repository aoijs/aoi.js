module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [element] = data.inside.splits;

    const index = d.array.indexOf(element.addBrackets());

    if (index !== -1) {
        d.array.splice(index, 1);
    }

    d.data.array = d.array;

    return {
        code: d.util.setCode(data),
        data: d.data,
        array: d.array
    }
}