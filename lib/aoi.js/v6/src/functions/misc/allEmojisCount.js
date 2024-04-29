module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [type] = data.inside.splits;
    data.result = type
        ? d.client.emojis.cache.filter((x) =>
            type === "animated"
                ? x.animated
                : type === "roles"
                    ? x.roles.cache.size
                    : type === "normal"
                        ? !x.animated
                        : x[type],
        ).size
        : d.client.emojis.cache.size;
    return {
        code: d.util.setCode(data)
    };
};