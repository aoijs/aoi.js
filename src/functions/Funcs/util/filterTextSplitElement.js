module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [query, type = "equal", separator = ","] = data.inside.splits;
    if (!["equal", "starts", "ends", "includes"].includes(type)) return d.aoiError.fnError(d, "custom", {inside: data.inside}, `Invalid Type Provided In`);

    switch (type) {
        case "equal" :
            data.result = d.array.filter(x => x === query)
            break;
        case "starts":
            data.result = d.array.filter(x => x.startsWith(query))
            break;
        case "ends" :
            data.result = d.array.filter(x => x.endsWith(query))
            break;
        case "includes":
            data.result = d.array.filter(x => x.includes(query))
            break;
    }

    return {
        code: d.util.setCode(data)
    }
}