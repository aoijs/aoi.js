module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [table, ...vars] = inside.splits;

    vars.forEach(x => {
        const [name, value] = x.split(":");
        d.client.variableManager.add({
            name: name.addBrackets(),
            value: value.addBrackets()
        }, table === "" ? d.client.db.tables[0] : table)
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}