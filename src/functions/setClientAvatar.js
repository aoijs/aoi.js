/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [avatar] = data.inside.splits;

    d.client.user.setAvatar(avatar.addBrackets()).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, `Failed To Set Client Avatar To "${avatar.addBrackets()}" With Reason: ${err}`);
    });

    return {
        code: d.util.setCode(data)
    }
}
