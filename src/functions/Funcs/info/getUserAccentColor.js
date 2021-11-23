module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [userId] = data.inside.splits;

    const user = await d.util.getUser(d, userId);
    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    if (!user.accentColor) {
        user.fetch()
    }

    data.result = user.hexAccentColor;

    return {
        code: d.util.setCode(data)
    }
}