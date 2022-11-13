module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [channelID = d.channel?.id] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    data.result = channel.rateLimitPerUser || 0;

    return {
        code: d.util.setCode(data)
    }
}