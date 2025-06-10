/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [text, pattern, flag = "g"] = data.inside.splits;

    if (!text) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Text Provided In");
    
    if (![...flag].every(char => ["g", "i", "m", "s", "u", "y"].includes(char))) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Flag Provided In")
        
    const regex = new RegExp(pattern, flag);

    data.result = regex.test(text);

    return {
        code: d.util.setCode(data)
    }
}