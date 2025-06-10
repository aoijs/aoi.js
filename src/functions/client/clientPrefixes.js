/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    
    let [separator = ','] = data.inside.splits;
    
    if (Array.isArray(d.client.prefix)) {
        data.result = d.client.prefix.join(separator);
    } else {
        data.result = d.client.prefix;
    }

    return {
        code: d.util.setCode(data),
    };
};
