module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [channelId, messageId, index = 1, option = 'url'] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, 'message', {inside: data.inside});

    const attachments = [...message.attachments.values()];
    if (!attachments.length) return d.aoiError.fnError(d, 'custom', {}, "Message Doesn't Have Any Attachments");

    data.result = attachments[index-1][option];

    return {
        code: d.util.setCode(data)
    }
}
