module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [userId, size = "4096", dynamic = "yes", format = "webp"] =
        data.inside.splits;

    const user = await d.util.getUser(d, userId);
    if (!user) return d.aoiError.fnError(d, "user", {inside: data.inside});

    if (!user.banner) {
        await user.fetch();
    }

    if (!user.banner) data.result = "null";
    else {
        data.result = user.bannerURL({
            size: Number(size),
            dynamic: dynamic === "yes",
            format,
        });
    }

    return {
        code: d.util.setCode(data),
    };
};
