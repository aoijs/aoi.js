module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID, messageID, index = 1, option = 'url'] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, 'message', {inside: data.inside});

    const attachments = [...message.attachments.values()];
    if (!attachments.length) return d.aoiError.fnError(d, 'custom', {}, "Message Doesn't Have Any Attachments");

    data.result = attachments[index - 1][option];

    return {
        code: d.util.setCode(data)
    }
}
