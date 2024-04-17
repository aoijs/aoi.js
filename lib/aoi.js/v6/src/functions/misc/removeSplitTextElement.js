module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [...elements] = data.inside.splits;

    for (const element of elements) {
        const index = d.array.indexOf(element.addBrackets());

        if (index !== -1) {
            d.array.splice(index, 1);
        }
    }
    d.data.array = d.array;

    return {
        code: d.util.setCode(data),
        data: d.data,
        array: d.array
    }
}