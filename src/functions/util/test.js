module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [text, pattern, flag = "g"] = data.inside.splits;
    
    if (!["g", "i", "m", "s", "u", "y"].includes(flag)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Flag Provided In")
    
    const regex = new RegExp(pattern, flag);

    data.result = regex.test(text);

    return {
        code: d.util.setCode(data)
    }
}