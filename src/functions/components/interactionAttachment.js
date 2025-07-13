/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [ optionName, optionToReturn = "url" ] = data.inside.splits;

    data.result = d.data.interaction?.options.getAttachment(optionName.addBrackets())?.[optionToReturn];

    return {
        code: d.util.setCode(data)
    }
} 
