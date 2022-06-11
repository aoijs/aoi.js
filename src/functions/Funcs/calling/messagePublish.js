module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [messageId = d.message?.id, channelId = d.channel?.id] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    const message = messageId === d.message?.id ? d.message : await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, 'message', {inside: data.inside});

    message.crosspost().catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Faild To Publish The Message With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}