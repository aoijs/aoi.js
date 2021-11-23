module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [type, name, option = "$default"] = data.inside.splits;

    data.result = d.client.cacheManager.caches[type]?.[name]
    data.result = option === '$default' ? data.result : eval(`data.result?.${option}`);

    return {
        code: d.util.setCode(data)
    }
}