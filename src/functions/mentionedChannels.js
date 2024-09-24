/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [index, returnSelf = 'true'] = data.inside.splits;

    index = Number(index) - 1;
    if (isNaN(index)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Invalid Index Provided In");

    data.result = [...d.mentions.channels.values()][index]?.id || (returnSelf === 'true' ? d.channel?.id : "undefined");

    return {
        code: d.util.setCode(data)
    }
}