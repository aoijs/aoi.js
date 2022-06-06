module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id, size = 4096, dynamic = 'yes', format] = data.inside.splits;

    const user = (userID === d.author?.id) ? d.author : (await d.util.getUser(d, userID));
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