module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [objectName, option] = data.inside.splits;

    const object = d.data.objects?.[objectName];
    if (!object) return d.aoiError.fnError("Object not found");

    try {
        if (option.startsWith("[")) {
            data.result = eval(`object${option}`);
        } else {
            data.result = eval(`object.${option}`);
        }
    } catch (e) {
        console.log(e);
        data.result = "undefined";
    }

    return {
        code: d.util.setCode(data)
    };
};
