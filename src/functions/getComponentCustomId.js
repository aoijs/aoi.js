/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let interaction = d.data?.interaction

    if (!interaction) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "interaction");

    data.result = d.data.interaction.customId

    return {
        code: d.util.setCode(data)
    }
}