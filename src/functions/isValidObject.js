/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [json] = data.inside.splits;
    let validObject

    try {
        json = JSON.parse(json.addBrackets());
        validObject = true;

    } catch (e) {
        validObject = false;
    }

    data.result = validObject

    return {
        code: d.util.setCode(data)
    }
}