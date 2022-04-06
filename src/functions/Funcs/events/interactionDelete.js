module.exports = async d => {
    const data = d.util.openFunc(d);

    await d.data.interaction?.deleteReply().catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Reply With Reason: ' + e)
    });

    return {
        code: d.util.setCode({
            function: d.func,
            code: data.code,
            result: undefined
        })
    }
} 