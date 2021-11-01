module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [name, type = 'PLAYING', status = 'online'] = data.inside.splits;

    try {
        d.client.user.setPresence({
            name: name.addBrackets(),
            type,
            status
        });
    }
    catch (err) {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Set Status With Reason: ' + err);
    }

    return {
        code: d.util.setCode(data)
    }
}