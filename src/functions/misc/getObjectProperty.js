/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [objectName, option] = data.inside.splits;

    const object = d.data.objects?.[objectName];
    if (!object) return d.aoiError.fnError("Object not found");

    // Security: safe property access instead of eval() to prevent RCE
    try {
        const keys = option
            .replace(/\[["']?/g, ".")
            .replace(/["']?\]/g, "")
            .split(".")
            .filter(Boolean);
        data.result = keys.reduce((obj, key) => obj?.[key], object);
    } catch (e) {
        data.result = "undefined";
    }

    data.result = typeof data.result === "object" ? JSON.stringify(data.result) : data.result;

    return {
        code: d.util.setCode(data)
    };
};
