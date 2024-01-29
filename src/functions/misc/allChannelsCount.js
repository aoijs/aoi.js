module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [type] = data.inside.splits

    type = d.util.channelTypes[type] ?? type;
    data.result = type
        ? d.client.channels.cache.filter((x) =>
            type === "NSFW" ? (x.nsfw === true) : (x.type === type),
        ).size
        : d.client.channels.cache.size;
    return {
        code: d.util.setCode(data),
    };
};
