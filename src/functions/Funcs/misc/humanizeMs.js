const {Time} = require('../../../utils/helpers/customParser.js');

module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [time] = data.inside.splits;

    if (isNaN(time)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Invalid Time Provided In");

    data.result = Time.format(Number(time)).humanize();

    return {
        code: d.util.setCode(data)
    }
}