module.exports = async d => {
    const data = d.util.openFunc(d);
    if (err) return d.error(err)

    let [channelId, threadId] = inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const thread = channel.threads.cache.get(threadId);
    if (!thread) return d.aoiError.fnError(d, "custom", {inside: data.inside}, "Invalid ThreadId Provided In");

    thread.leave();

    return {
        code: d.util.setCode(data)
    }

}