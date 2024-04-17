module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const { code } = d.command;
    if (data.err) return d.error(data.err);

    let [name, property, value] = data.inside.splits;
    if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "object");

    try {
        value = JSON.parse(value);
    } catch (e) {
        value = value;
    }

    const object = d.data.objects[name] || {};
    try {
        eval(`object?.${property} = value`);
    } catch (e) {
        data.result = undefined;
    }
    
    d.data.objects[name] = object;

    return {
        code: d.util.setCode({ function: d.func, code: code, inside: data.inside }),
        data:d.data,
    };
};
