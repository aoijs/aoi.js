const {wait} = require('../../../utils/helpers/functions.js');
const {Time} = require('../../../utils/helpers/customParser.js');
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [time] = data.inside.splits;

    const timer = isNaN(time) ? Time.parse(time)?.ms || 0 : Number(time);

    await wait(timer);

    return {
        code: d.util.setCode(data)
    }
}