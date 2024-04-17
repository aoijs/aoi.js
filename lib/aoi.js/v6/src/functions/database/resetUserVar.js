
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [varname, guildID = d.guild?.id, table = d.client.db.tables[0]] = data.inside.splits;

    if (!d.client.variableManager.has(varname.addBrackets(), table)) return d.aoiError.fnError(d, "custom", {}, `Variable ${varname.addBrackets()} doesn't exist`);

    await d.client.db.deleteMany(table, (Data) => {
        return (
            Data.key.startsWith(`${varname}_`) &&
            Data.key.split("_").length === 3 && 
            Data.key.endsWith(`_${guildID}`)
        );
    });

    return {
        code: d.util.setCode(data),
    };
};