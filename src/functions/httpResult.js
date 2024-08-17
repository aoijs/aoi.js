module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let properties = data.inside.splits;
    let isObject = (d.data.http?.contentType.includes("json") && properties.length) ?? false;
    
    if (isObject) {
        let response = d.data.http.result;
        for (const property of properties) {
            if (!Object.prototype.hasOwnProperty.call(response, property)) {
                return d.aoiError.fnError(d, "custom", {
                    inside: data.inside
                }, `Invalid property "${property}" in HTTP result!`)
            }

            response = response?.[property];
        }
        
        data.result = typeof response !== "string"
            ? JSON.stringify(response)
            : String(response);
    } else {
        data.result = typeof d.data.http?.result === "object"
            ? JSON.stringify(d.data.http?.result)
            : d.data.http?.result;
    }

    return {
        code: d.util.setCode(data),
        data: d.data
    }
}