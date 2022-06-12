module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const emoji = data.inside.inside;

    data.result = d.client.emojis.cache.find(
        (x) =>
            x.name.toLowerCase() === emoji.addBrackets().toLowerCase() ||
            x.toString() === emoji.addBrackets(),
    );

    return {
        code: d.util.setCode(data),
    };
};