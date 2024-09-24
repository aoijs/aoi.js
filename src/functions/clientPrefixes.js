/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    if (Array.isArray(d.client.prefix)) {
        data.result = d.client.prefix.join(" , ");
    } else {
        data.result = d.client.prefix;
    }

    return {
        code: d.util.setCode(data),
    };
};
