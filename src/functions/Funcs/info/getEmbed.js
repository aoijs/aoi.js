const {EmbedData} = require('../../../utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);
    let [channelId = d.channel?.id, messageId = d.message?.id, index = 1, option = 'description'] = data.inside.splits;
    index = index - 1;
    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, 'message', {inside: data.inside});

    const embedData = EmbedData(message.embeds[index], message.embeds)
    try {
        data.result = eval(`embedData?.${option}`);

        data.result = typeof data.result === 'object' ? JSON.stringify(data.result, null, 2) : data.result;
    } catch (e) {
        data.result = ''
    }
    return {
        code: d.util.setCode(data)
    }
}