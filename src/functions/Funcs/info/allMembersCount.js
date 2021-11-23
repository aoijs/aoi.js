module.exports = async d => {
    const {code} = d.command
    const result = d.client.guilds.cache.map(x => x.memberCount ?? 0).reduce((a, b) => a + b)
    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}