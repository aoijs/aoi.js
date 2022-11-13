module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [messageID, channelID = d.channel?.id] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    data.result = (await d.util.getMessage(channel, messageID)) ? true : false;

    return {
        code: d.util.setCode(data)
    }
}