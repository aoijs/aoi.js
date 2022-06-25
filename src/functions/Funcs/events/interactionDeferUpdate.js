module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = await d.data.interaction?.deferUpdate().catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Reply With Reason: ' + e)
    });
    return {
        code: d.util.setCode(data)
    }
}