module.exports = async (d) => {
    const data = d.util.openFunc(d);

    const [size = "4096", dynamic = "yes", format = "webp"] = data.inside.splits;

    if (!d.author?.banner) {
        await d.author?.fetch();
    }

    if (!d.author.banner) data.result = "null";
    else {
        data.result = d.author?.bannerURL({
            size: Number(size),
            dynamic: dynamic === "yes",
            format,
        });
    }

    return {
        code: d.util.setCode(data),
    };
};
