module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name] = data.inside.splits;
    const array = d.data.arrays[name];
    let ArrayResult;

    if (!d.data.arrays?.[name]) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Array with name '" + name + "' does not exist.");
    
    if (array.length === 0 || (array.length === 1 && array[0] === '')) {
        ArrayResult = "[]";
    } else {
        ArrayResult = JSON.stringify(array);
    }

    data.result = ArrayResult;
    return {
        code: d.util.setCode(data)
    };
};
