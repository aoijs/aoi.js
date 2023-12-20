module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [texts] = data.inside.splits;

    data.result = texts
        .split(" ")
        .map(
            (text) =>
                text.addBrackets().slice(0, 1).toUpperCase() +
                text.addBrackets().slice(1).toLowerCase(),
        ).join(" ");

    return {
        code: d.util.setCode(data),
    };
};