module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [index, text] = data.inside.splits;
    data.function = d.func;
    index = index - 1;

    if (isNaN(index) || index < 0)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside},
            "Invalid Index Provided In",
        );

    d.array[index] = text;

    return {
        code: d.util.setCode(data),
        data: {
            ...d.data,
            array: d.array,
        },
    };
};