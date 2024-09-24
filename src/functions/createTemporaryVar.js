/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [table, ...vars] = data.inside.splits;

    vars.forEach(x => {
        const [name, value] = x.split(":");
        d.client.variableManager.add(
            {
                name: name.addBrackets(),
                value: value.addBrackets(),
                table: table === "" ? d.client.db.tables[0] : table.addBrackets(),
            },
            table === "" ? d.client.db.tables[0] : table,
        );
    });

    return {
        code: d.util.setCode(data)
    }
}