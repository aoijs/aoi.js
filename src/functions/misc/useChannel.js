module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const channelID = data.inside.inside;

    const channel = await d.util.getChannel(d, channelID, true);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    return {
        code: d.util.setCode(data),
        useChannel: channel,
    }
}