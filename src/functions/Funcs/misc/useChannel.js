module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const channelId = data.inside.inside;

    const channel = await d.util.getChannel(d, channelId, true);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    return {
        code: d.util.setCode(data),
        useChannel: channel,
    }
}