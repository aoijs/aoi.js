/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [args] = data.inside.splits;

    if (isNaN(args) && args < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Index Provided In");

    data.result = args ? d.args[args - 1]?.deleteBrackets() : d.args?.join(" ")?.deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
}
