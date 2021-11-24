module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [channelId, topic] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    channel.setTopic(topic.addBrackets()).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, `Failed To Set Channel Topic With Reason: ${err}`);
    });

    return {
        code: d.util.setCode(data)
    }
}