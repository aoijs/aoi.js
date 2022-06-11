const {Time} = require('../../../utils/helpers/customParser.js');

module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [time, channelId = d.channel?.id] = data.inside.splits;

    const channel = d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    time = isNaN(time) ? Time.parse(time)?.ms : Number(time);

    channel.edit({
        rateLimitPerUser: (time / 1000).toFixed(0)
    }).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Set Slowmode With Reason: ' + err);
    });

    return {
        code: d.util.setCode(data)
    }
}