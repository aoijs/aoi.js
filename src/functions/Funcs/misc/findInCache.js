module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [type, name, prop, value, findType = "===", returnValue = "$default"] = data.inside.splits;
    prop = prop.trim() === "" ? "" : "?." + prop

    findType = (
        ["includes", "startsWith", "endsWith"].includes(findType) ? findType : (
            [">=", "==", "===", "<=", "<", ">"].includes(findType) ? findType : d.aoiError.fnError(d, "custom", {inside: data.inside}, "Invalid FindType Provided In")
        )
    )
    try {
        if (["includes", "startsWith", "endsWith"].includes(findType)) {
            data.result = eval(`d.client.cacheManager.caches[type][name].find(x => (prop.trim() === "" ? x : x${prop})[findType](value))`);

            data.result = typeof data.result === "object" ? returnValue === "$default" ? JSON.stringify(data.result, null, 2) : eval(`data.result?.${returnValue}`) : data.result
        } else {
            data.result = eval(`d.client.cacheManager.caches[type][name].find(x => (prop.trim() === "" ? x : x${prop}
            ${findType} ${value}
            )`);


        }
    } catch (e) {
        console.error(e);
        data.result = ""
    }

    return {
        code: d.util.setCode(data)
    }
}