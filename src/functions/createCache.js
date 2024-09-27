/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [type, name, options] = data.inside.splits;

    d.client.cacheManager.createCache(type, name, options);

    return {
        code: d.util.setCode(data)
    }
} 