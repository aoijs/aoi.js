const {
    AoijsAPI
} = require("../../classes/Database.js");

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

    const all = await d.client.db.all(table, varname.addBrackets(), 1);
    if (d.client.db instanceof AoijsAPI) {
        all
            .filter(async (x) => await d.util.getUser(d, x.key.split("_")[1]))
            .forEach(async (x) => await d.client.db.delete(table, x.key));
    }
    return {
        code: d.util.setCode(data),
    };
};