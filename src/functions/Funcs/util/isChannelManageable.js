module.exports = async d => {
    const data = d.util.openFunc(d)
    if (data.err) return d.error(data.err);
    const [channelId = d.channel?.id] = data.inside.splits;
    const channel = await d.util.getChannel(d, channelId)
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});
    data.result = channel.manageable
    return {
        code: d.util.setCode(data)
    }
}
//Usage: $isChannelManageable[channel id(optional)]
