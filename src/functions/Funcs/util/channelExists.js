module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) d.error(err);

    let [channel] = inside.splits;

    channel = d.client.channels.cache.find(x => x.name.toLowerCase() === channel.toLowerCase().addBrackets() || x.id === channel)

    const result = channel ? true : false

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}