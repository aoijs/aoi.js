module.exports = async d => {
    const data = d.util.openFunc(d);

    const [channelId = d.channel?.id] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    data.result = channel.rateLimitPerUser || 0;

    return {
        code: d.util.setCode(data)
    }
}