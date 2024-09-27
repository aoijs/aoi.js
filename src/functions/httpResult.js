/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    let [name = "res", ...properties] = data.inside.splits;

    if (!d.requests[name]) {
        return d.aoiError.fnError(d, "custom", {
            inside: data.inside
        }, `Invalid request name "${name}"!`)
    }

    if (!properties.length) {
        data.result = typeof d.requests[name].result === "object"
            ? JSON.stringify(d.requests[name].result)
            : d.requests[name].result;
    } else if (isObject) {
        let response = d.requests[name].result;
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
    }

    return {
        code: d.util.setCode(data),
        requests: d.requests
    }
}