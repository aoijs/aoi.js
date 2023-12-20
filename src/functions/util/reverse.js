module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text] = data.inside.splits;

    data.result = text.split("").reverse().join("");

    return {
        code: d.util.setCode(data),
    };
};
