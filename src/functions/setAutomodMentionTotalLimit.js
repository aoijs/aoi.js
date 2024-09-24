/**
 * @param {import("..").Data} d
 */
module.exports = async(d) => {
    const data = d.util.aoiFunc(d);
    const [limit] = data.inside.splits;

    if (!isNaN(limit.addBrackets())) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "limit");

    return {
        code: d.util.setCode(data),
        data: { 
            automodRule: { 
                ...d.data.automodRule,
                mentionTotalLimit: limit.addBrackets(), 
            },
        },
    };
}