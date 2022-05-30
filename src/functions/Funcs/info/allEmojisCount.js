module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [type] = data.inside.splits;

    data.result = type ? d.client.emojis.cache.filter(x => x.type === type).size : d.client.emojis.cache.size
    return {
        code: d.util.setCode(data)
    }
}