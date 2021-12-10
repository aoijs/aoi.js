module.exports = async (d) => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [varname, table = d.client.db.tables[0]] = data.inside.splits;

    if (!d.client.variableManager.cache.has(varname.addBrackets()))
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            `Variable ${varname.addBrackets()} Doesn't Exist!`,
        );

    const all = await d.client.db.all(table, varname.addBrackets(), 2, [
        0,
        guildId,
    ]);
    all.forEach(async (x) => await d.client.db.delete(table, x.key));

    return {
        code: d.util.setCode(data),
    };
};
