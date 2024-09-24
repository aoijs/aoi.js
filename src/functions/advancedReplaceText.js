/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [...replace] = data.inside.splits;
    let [text, ...replacements] = replace;

    for (let i = 0; i < replacements.length; i += 2) {
        const replacer = replacements[i];
        const replaceTo = replacements[i + 1];
        text = text.replaceAll(replacer.addBrackets(), replaceTo.addBrackets());
    }

    data.result = text.addBrackets();

    return {
        code: d.util.setCode(data)
    };
};
