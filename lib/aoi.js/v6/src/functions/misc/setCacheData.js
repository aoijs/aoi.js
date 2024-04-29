module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [type, cacheName, cacheKey, cacheValue] = data.inside.splits;

    if (!d.client.cacheManager.caches[type])
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.insde},
            `Cache type ${type} does not exist.`,
        );
    let value;
    try {
        value = JSON.parse(cacheValue.addBrackets());
    } catch {
        value = cacheValue.addBrackets();
    }

    d.client.cacheManager.caches[type][cacheName.addBrackets()][
        d.client.cacheManager.caches[type][cacheName.addBrackets()].set
            ? "set"
            : "add"
        ](cacheKey.addBrackets(), value);

    return {
        code: d.util.setCode(data),
    };
};