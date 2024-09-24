/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [ option ] = data.inside.splits;

    data.result = d.data.interaction.options.getAttachment(option.addBrackets()).url;

    return {
        code: d.util.setCode(data)
    }
} 