/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [type, cacheName, cacheKey] = data.inside.splits;

    if (!d.client.cacheManager.caches[type])
        return d.aoiError.fnError(
            d,
            "custom",
            { inside: data.inside },
            `Cache type ${type} does not exist.`,
        );

    const cache = d.client.cacheManager.caches[type][cacheName.addBrackets()];
    if (!cache) {
        return d.aoiError.fnError(
            d,
            "custom",
            { inside: data.inside },
            `Cache name ${cacheName} does not exist.`
        );
    }

    if (cacheKey) {
        cache.delete(cacheKey.addBrackets());
    } else {
        for (const key of cache.keys()) {
            cache.delete(key);
        }
    }

    return {
        code: d.util.setCode(data),
    };
};
