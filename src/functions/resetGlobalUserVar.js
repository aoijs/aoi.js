
/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [varname, table = d.client.db.tables[0]] = data.inside.splits;

    if (!d.client.variableManager.has(varname.addBrackets(), table))
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            `Variable ${varname.addBrackets()} Doesn't Exist!`,
        );

    await d.client.db.deleteMany(table, (Data) => Data.key.startsWith(`${varname}_`));

    return {
        code: d.util.setCode(data),
    };
};