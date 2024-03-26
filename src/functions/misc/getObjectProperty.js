module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [objectName, option] = data.inside.splits;

    const object = d.data.objects?.[objectName];
    if (!object) return d.aoiError.fnError(d, "custom", {}, "Invalid Object Provided In");

    try {
        const properties = option.split(".");
        let evaled = object;

        for (let prop of properties) {
            let match;
            if ((match = prop.match(/(\w+)((\[\d+\])*)/))) {
                let arrayIndices = match[2].match(/\d+/g);
                evaled = evaled[match[1]];
                if (arrayIndices) {
                    for (let index of arrayIndices) {
                        evaled = evaled[parseInt(index)];
                    }
                }
            } else if (prop in evaled) {
                evaled = evaled[prop];
            } else {
                evaled = "undefined";
                break;
            }
        }

        data.result = typeof evaled === "object" ? JSON.stringify(evaled) : evaled ?? "undefined";
    } catch (e) {
        data.result = "undefined";
    }

    return {
        code: d.util.setCode(data)
    };
};
