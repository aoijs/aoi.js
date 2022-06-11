module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [username] = data.inside.splits;

    d.client.user.setUsername(username.addBrackets())

        .catch(err => {
            d.aoiError.fnError(d, 'custom', {}, `Failed To Set Bot Username To "${username.addBrackets()}" With Reason: ${err}`);
        });

    return {
        code: d.util.setCode(data)
    }
}