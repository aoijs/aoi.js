module.exports = d => {
    const data = d.util.aoiFunc(d);

    let [text] = data.inside.splits;
    data.result = text.trim();

    return {
        code: d.util.setCode(data)
    }
}