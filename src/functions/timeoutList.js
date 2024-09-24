/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [format = "key", separator = " , "] = data.inside.splits;

    const timeouts = await d.client.db.findMany("__aoijs_vars__", (data) => {
        return data.key.startsWith("setTimeout_");
    });

    if (timeouts) {
        const timeoutData = timeouts.map((x) => {
            if (format === "duration") {
                return x.value.__duration__;
            } else if (format === "key") {
                return x.key;
            } else if (format === "id") {
                return x.value.__id__;
            } else {
                return format
                    .replaceAll("{duration}", x.value.__duration__)
                    .replaceAll("{key}", x.key)
                    .replaceAll("{id}", x.value.__id__);
            }
        });

        data.result = timeoutData.join(separator);
    } else {
        data.result = null;
    }

    return {
        code: d.util.setCode(data)
    };
};