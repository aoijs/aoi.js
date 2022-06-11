module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userId = d.author?.id] = data.inside.splits;

    const user = (userId === d.author?.id) ? d.author : (await d.util.getUser(d, userId));
    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    data.result = user.discriminator;

    return {
        code: d.util.setCode(data)
    }
}