const {Message} = require('../../../utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.openFunc(d);

    const [channelId = d.channel.id, messageId = d.message.id, option = 'cleanContent'] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, 'message', {inside: data.inside});

    data.result = eval(`Message( message )?.${option}`);

    return {
        code: d.util.setCode(data)
    }
}