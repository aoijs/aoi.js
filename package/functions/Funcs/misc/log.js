module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [msg] = data.inside.splits;

    console.log(msg.addBrackets());

    return {
        code: d.util.setCode(data)
    }
}