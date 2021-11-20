module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [type, cacheName, cacheValue] = data.inside.splits;

    d.client.cacheManager.caches[type][cacheName.addBrackets()] = cacheValue.addBrackets();

    return {
        code: d.util.setCode(data)
    }
}