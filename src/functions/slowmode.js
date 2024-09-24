const {Time} = require('../core/Time.js');

/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [time, channelID = d.channel?.id] = data.inside.splits;

    const channel = d.util.getChannel(d, channelID);
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