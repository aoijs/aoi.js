module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, element] = data.inside.splits;

    const index = d.array[name].indexOf(element.addBrackets());

    if (index !== -1) {
        d.array[name].splice(index, 1);
    }

    d.data.array = d.array;

    return {
        code: d.util.setCode(data),
        data: d.data,
        array: d.array
    }
}