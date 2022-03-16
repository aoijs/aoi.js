module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, sep = ' , '] = data.inside.splits;

    const user = await d.util.getUser(d, userId);

    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    data.result = user.flags?.toArray().join(sep) || 'none';

    return {
        code: d.util.setCode(data)
    }
}
