module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [index, returnSelf = 'yes'] = data.inside.splits;

    index = Number(index) - 1;
    if (isNaN(index)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Invalid Index Provided In");

    data.result = [...d.mentions.users.values()][index]?.id || (returnSelf === 'yes' ? d.author?.id : "undefined");

    return {
        code: d.util.setCode(data)
    }
}