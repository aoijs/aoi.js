module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [size = 4096, dynamic = 'true', extension] = data.inside.splits;

    if (!d.author?.banner) {
        await d.author?.fetch({force: true});
    }

    if (!d.author.banner) data.result = "null";
    else {
        data.result = d.author?.bannerURL({
            size: Number(size),
            forceStatic: dynamic === 'false',
            extension,
        });
    }

    return {
        code: d.util.setCode(data),
    };
};
