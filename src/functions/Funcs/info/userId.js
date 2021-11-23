module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [user] = data.inside.splits;

    const res = d.client.users.cache.findKey(x => x.username.toLowerCase() === user.addBrackets().toLowerCase());
    if (!res) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid User Provided In');

    data.result = res.id;

    return {
        code: d.util.setCode(data)
    }
}