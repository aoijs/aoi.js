module.exports = async d => {
    const {code, inside} = d.util.aoiFunc(d);

    const [args] = inside.splits;

    if (isNaN(args) && args < 1) return d.aoiError.fnError(d, "custom", {inside}, "Invalid Index Provided In");

    const result = args ? d.args[args - 1]?.deleteBrackets() : d.args.join(" ")?.deleteBrackets();

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}