/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [ value = "1", sep = "," ] = data.inside.splits; 

    let interaction = d.data?.interaction

    if (!interaction) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "interaction");

    if (value.toLowerCase() === "all") {
        data.result = d.data.interaction.values.join(sep);
    } else {
        if (isNaN(Number(value)) || Number(value - 1) < 0) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "number");

        data.result = interaction.values[Number(value - 1)]
    }

    return {
        code: d.util.setCode(data)
    }
}