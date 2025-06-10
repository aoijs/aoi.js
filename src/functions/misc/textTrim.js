/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);

    let [text] = data.inside.splits;
    data.result = /\n/.test(text) 
        ? text.split(/\n/).map(l => l.trim()).filter(l => l !== "").join("\n") 
        : text.trim();

    return {
        code: d.util.setCode(data)
    }
}