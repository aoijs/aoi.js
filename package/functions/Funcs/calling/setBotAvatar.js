module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [avatar] = data.inside.splits;

    d.client.user.setAvatar(avatar.addBrackets()).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, `Failed To Set Bot Avatar To "${avatar.addBrackets()}" With Reason: ${err}`);
    });

    return {
        code: d.util.setCode(data)
    }
}