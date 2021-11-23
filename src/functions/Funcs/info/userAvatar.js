module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, size = 4096, dynamic = 'yes', format] = data.inside.splits;

    const user = (userId === d.author?.id) ? d.author : (await d.util.getUser(d, userId));
    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    data.result = user.displayAvatarURL({
        size: Number(size),
        dynamic: dynamic === 'yes',
        format
    });

    return {
        code: d.util.setCode(data)
    }
}