/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [variable, id, table = d.client.db.tables[0]] = data.inside.splits;

    if (!d.client.variableManager.has(variable.addBrackets(), table)) return d.aoiError.fnError(d, "custom", {}, `Variable: ${variable.addBrackets()} Doesn't Exist In Table: ${table}`);
    d.client.db.delete(table, variable, id);

    return {
        code: d.util.setCode(data)
    }
}