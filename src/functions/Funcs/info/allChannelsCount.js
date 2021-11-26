module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    let [type] = inside.splits;
    type = type ? d.util.channelTypes[type] : type;
    const result = type
        ? d.client.channels.cache.filter((x) => x.type === type).size
        : d.client.channels.cache.size;
    return {
        code: d.util.setCode({function: d.func, code, inside, result}),
    };
};
