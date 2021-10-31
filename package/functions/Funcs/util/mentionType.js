module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [mention] = data.inside.splits;

    mention = mention.replace(/[\\<>!@&]/, "");

    for (const [type, cache] of Object.entries(d.mentions)) {
        if (cache.has(mention)) {
            data.result = type;
            break;
        }
    }

    return {
        code: d.util.setCode(data)
    }
}