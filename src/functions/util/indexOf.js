module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [string, char] = data.inside.splits;
    string = string.addBrackets();
    char = char.addBrackets();

    data.result = string.indexOf(char) + 1;

    return {
        code: d.util.setCode(data)
    }
}