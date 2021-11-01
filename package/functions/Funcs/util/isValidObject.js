module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [json] = data.inside.splits;
    let validObject = false;

    try {
        json = JSON.parse(json.addBrackets());
        validObject = true;

    } catch (e) {
    }

    return {
        code: d.util.setCode(data)
    }
}