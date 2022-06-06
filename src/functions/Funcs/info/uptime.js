const {Time} = require('../../../utils/helpers/customParser.js');

module.exports = d => {
    const data = d.util.aoiFunc(d);

    const [option = 'full'] = data.inside.splits;

    data.result = option === 'ms' ? d.client.uptime : option === 'humanize' ? Time.format(d.client.uptime).humanize() : Time.format(d.client.uptime).toString();

    return {
        code: d.util.setCode(data)
    }
}