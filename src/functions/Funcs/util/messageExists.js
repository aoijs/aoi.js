module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [messageId, channelId = d.channel?.id] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    data.result = (await d.util.getMessage(channel, messageId)) ? true : false;

    return {
        code: d.util.setCode(data)
    }
}