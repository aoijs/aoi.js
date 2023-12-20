module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id, size = 4096, dynamic = 'true', extension] = data.inside.splits;

    const user = await d.util.getUser(d, userID);
    if (!user) return d.aoiError.fnError(d, "user", {inside: data.inside});

    if (!user.banner) {
        await user.fetch({force: true})
    }

    if (!user.banner) data.result = "null";
    else {
        data.result = user.bannerURL({
            size: Number(size),
            forceStatic: dynamic === 'false',
            extension,
        });
    }

    return {
        code: d.util.setCode(data),
    };
};
