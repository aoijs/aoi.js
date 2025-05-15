/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [timeoutId, format = "key"] = data.inside.splits;

    if (!timeoutId) return d.aoiError.fnError(d, "custom", {}, "Invalid Timeout ID Provided");

    const timeout = await d.client.db.get("__aoijs_vars__", "setTimeout", timeoutId);

    if (timeout) {
        switch (format) {
            case "duration":
                data.result = timeout.value.__duration__;
                break;
            case "key":
                data.result = timeout.key;
                break;
            case "id":
                data.result = timeout.value.__id__;
                break;
            default:
                data.result = format.replaceAll("{duration}", timeout.value.__duration__).replaceAll("{key}", timeout.key).replaceAll("{id}", timeout.value.__id__);
                break;
        }
    } else {
        data.result = null;
    }

    return {
        code: d.util.setCode(data)
    };
};
