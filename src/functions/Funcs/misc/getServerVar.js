module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [varname, guildId = d.guild?.id, table = d.client.db.tables[0]] = data.inside.splits;
    varname = varname.addBrackets();

    if (!d.client.variableManager.has(varname, table)) return d.aoiError.fnError(d, 'custom', {}, `Variable "${varname}" Not Found`);

    data.result = (await d.client.db.get(table, varname, guildId))?.value || d.client.variableManager.get(varname)?.default;

    data.result = typeof data.result === 'object' ? JSON.stringify(data.result) : data.result;

    return {
        code: d.util.setCode(data)
    }
}