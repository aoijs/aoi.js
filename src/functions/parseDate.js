const {Time} = require('../core/Time.js');

/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [time, type = 'date'] = data.inside.splits;

    if (new Date(Number(time)).toLocaleString('en-US') === "Invalid Date") return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Time Provided In');

    data.result = type === 'time' ? Time.format(Number(time)).toString() : new Date(Number(time)).toLocaleString('en-us', {
        timeZone: d.timezone
    });

    return {
        code: d.util.setCode(data)
    }
}