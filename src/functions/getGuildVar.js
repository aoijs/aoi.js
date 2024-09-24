/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [varname, guildID = d.guild?.id, table = d.client.db.tables[0]] = data.inside.splits;
    varname = varname.addBrackets();

    if (!d.client.variableManager.has(varname, table)) return d.aoiError.fnError(d, 'custom', {}, `Variable "${varname}" Not Found`);

    data.result =
        (await d.client.db.get(table, varname, guildID))?.value ??
        d.client.variableManager.get(varname, table)?.default;

    data.result = typeof data.result === 'object' ? JSON.stringify(data.result) : data.result;

    return {
        code: d.util.setCode(data)
    }
}