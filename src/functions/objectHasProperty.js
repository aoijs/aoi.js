/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [objectName, property] = data.inside.splits;

    const object = d.data.objects?.[objectName];
    if (!object) return d.aoiError.fnError("Object not found");

    data.result = object.hasOwnProperty(property);

    return {
        code: d.util.setCode(data)
    };
};
