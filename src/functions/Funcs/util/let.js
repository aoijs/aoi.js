module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [varname, varvalue] = data.inside.splits;

    d.vars[varname.addBrackets()] = varvalue.addBrackets();
    d.data.vars = d.vars;

    return {
        code: d.util.setCode(data),
        data: d.data
    }
}