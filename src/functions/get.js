module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    
    const [name] = data.inside.splits;

    if (!d.data?.vars?.[name.addBrackets()]) return d.aoiError.fnError(d, "custom", { inside: d.data.inside }, "Invalid variable name");

    data.result = d.data.vars[name?.addBrackets()];

    return {
        code: d.util.setCode(data)
    }
}