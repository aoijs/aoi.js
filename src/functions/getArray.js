module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name] = data.inside.splits;
    const array = d.data.arrays?.[name];

    if (!array) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Array with name '" + name + "' does not exist.");
    
    data.result = (array.length === 0 || (array.length === 1 && array[0] === '')) ? "[]" : JSON.stringify(array);

    return {
        code: d.util.setCode(data)
    };
};
