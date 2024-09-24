/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [type, name, key, option = "$default"] = data.inside.splits;

    data.result = d.client.cacheManager.caches[type]?.[name].get(key);
    data.result = option === '$default' ? data.result : eval(`data.result?.${option}`);

    if (typeof data.result === 'object' && data.result !== null) {
        data.result = JSON.stringify(data.result);
    }

    return {
        code: d.util.setCode(data)
    }
}
