/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(err);

    let [opt] = data.inside.splits;

    if (!["variable", "key", "value", "guild", "for", "type", "timestamp"].includes(opt)) return d.aoiError.fnError(d, "custom", { inside: data.inside }`Invalid Option Provided in`);

    data.result = d.data.oldVariable[opt];
    return {
        code: d.util.setCode(data)
    };
};
