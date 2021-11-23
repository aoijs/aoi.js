module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji] = data.inside.splits;

    data.result = d.client.emojis.cache.some(x => x.id === emoji || x.toString() === emoji || x.identifier.toLowerCase() === emoji.toLowerCase())

    return {
        code: d.util.setCode(data)
    }
}