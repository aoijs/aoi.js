module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [msg, userId = d.author?.id, returnId = 'no'] = data.inside.splits;

    const user = await d.util.getUser(d, userId);
    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    msg = await d.util.errorParser(msg, d);

    try {
        data.result = await d.aoiError.makeMessageError(d.client, user, msg, msg.options, d);
    } catch (err) {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Send Dm With Reason: ' + err);
    }
    data.result = returnId === 'yes' ? data.result : undefined;

    return {
        code: d.util.setCode(data)
    }
}