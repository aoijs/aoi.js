module.exports = async d => {
    const data = d.util.aoiFunc(d);
    data.result = d.client.guilds.cache.map(x => x.memberCount ?? 0).reduce((a, b) => a + b, 0)
    return {
        code: d.util.setCode(data)
    }
}