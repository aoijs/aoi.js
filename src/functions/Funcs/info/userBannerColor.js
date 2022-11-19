module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id] = data.inside.splits;

    const user = await d.util.getUser(d, userID);
    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    if (!user.accentColor) {
        await user.fetch({force: true})
    }

    data.result = user.hexAccentColor;

    return {
        code: d.util.setCode(data)
    }
}