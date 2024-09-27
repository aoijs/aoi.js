/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [msg, userID = d.author?.id, returnID = 'false'] = data.inside.splits;

    const user = await d.util.getUser(d, userID);
    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    msg = await d.util.errorParser(msg, d);

    try {
        data.result = await d.aoiError.makeMessageError(d.client, user, msg.data ?? msg, msg.options, d);
    } catch (err) {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Send Dm With Reason: ' + err);
    }
    data.result = returnID === 'true' ? data.result.id : undefined;

    return {
        code: d.util.setCode(data)
    }
}