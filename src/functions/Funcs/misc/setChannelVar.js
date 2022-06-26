module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [
        varname,
        value,
        channelId = d.channel.id,
        table = d.client.db.tables[0],
    ] = data.inside.splits;

    value = value.addBrackets();

    if (!d.client.variableManager.has(varname.addBrackets(), table))
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            `Variable ${varname.addBrackets()} Not Found!`,
        );

    const variable = d.client.variableManager.get(varname, table);

    if (!variable.checkType(value))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            `Variable "${varname.addBrackets()}" Needs Value Of Type "${
                variable.type
            }". Provided Wrong Type In`,
        );

    value = d.client.variableManager.parseData(value, variable.type);

    try {
        await d.client.db.set(table, varname.addBrackets(), channelId, value);
    } catch (e) {
        d.aoiError.fnError(
            d,
            "custom",
            {},
            `Failed To Set Value To The Variable: "${varname.addBrackets()}" With Reason: ${e}`,
        );
    }

    return {
        code: d.util.setCode(data),
    };
};