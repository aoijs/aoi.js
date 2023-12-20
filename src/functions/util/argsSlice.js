module.exports = (d) => {
    const data = d.util.aoiFunc(d);

    let [text, from = 0, to] = data.inside.splits;

    from = Number(from);
    to = to ? Number(to) : undefined;

    if (isNaN(from) || (to && isNaN(to)))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Number Provided In",
        );

    data.result = text.split(" ").slice(from, to).join(" ");

    return {
        code: d.util.setCode(data),
    };
};