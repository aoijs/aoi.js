const {Time} = require('../core/Time.js');

/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [time] = data.inside.splits;

    time = isNaN(time) ? time : Number(time);

    data.result = Time.parse(time);

    data.result = (typeof data.result === 'string' ? data.result : data.result?.ms) || -1;

    return {
        code: d.util.setCode(data)
    }
}