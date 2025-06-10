/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    
    const [type = "asc", separator = ", ", ...numbers] = data.inside.splits;

    if (type === "asc") {
        data.result = numbers.sort((a, b) => a - b);
    } else if (type === "desc") {
        data.result = numbers.sort((a, b) => b - a);
    } else {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid type provided. Must be either `asc` or `desc`");
    }

    data.result = data.result?.join(separator);

    return {
        code: d.util.setCode(data),
    };
}