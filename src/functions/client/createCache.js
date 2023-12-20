module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [type, name, options] = inside.splits;

    d.client.cacheManager.createCache(type, name, options);

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
} 