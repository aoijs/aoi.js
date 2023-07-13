module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [variable, id, table = d.client.db.tables[0]] = inside.splits;

    if (!d.client.variableManager.has(variable.addBrackets(), table)) return d.aoiError.fnError(d, "custom", {}, `Variable: ${variable.addBrackets()} Doesn't Exist In Table: ${table}`);
    d.client.db.delete(table, variable, id);

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}