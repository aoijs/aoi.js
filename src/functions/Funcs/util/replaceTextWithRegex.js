module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [text, reg, flags, newT] = data.inside.splits;

    reg =
        reg.startsWith("/") && reg.endsWith("/")
            ? reg.slice(1, reg.length - 1)
            : reg;

    if (newT === undefined)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            `Invalid Amount Of Fields In`,
        );

    data.result = text
        .addBrackets()
        .replace(
            new RegExp(reg.addBrackets(), flags || undefined),
            newT.addBrackets(),
        )
        .deleteBrackets();

    return {
        code: d.util.setCode(data),
    };
};
