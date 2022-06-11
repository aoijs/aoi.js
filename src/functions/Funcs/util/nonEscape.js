module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [msg] = data.inside.splits;

    data.result = msg.addBrackets();

    return {
        code: d.util.setCode(data, false)
    }
}