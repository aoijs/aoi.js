/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [name, property, value] = data.inside.splits;
    if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "Invalid object");

    try {
        value = JSON.parse(value);
    } catch (e) {
        data.result = undefined;
    }

    const object = d.data.objects[name] || {};
    try {
        eval(`object.${property} = ${JSON.stringify(value)}`);
    } catch (e) {
        data.result = undefined;
    }
    
    d.data.objects[name] = object;

    return {
        code: d.util.setCode(data),
        data: d.data,
    };
};