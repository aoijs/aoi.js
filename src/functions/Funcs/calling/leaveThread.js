module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (err) return d.error(err)

    let [channelID, threadId] = inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const thread = channel.threads.cache.get(threadId);
    if (!thread) return d.aoiError.fnError(d, "custom", {inside: data.inside}, "Invalid ThreadId Provided In");

    thread.leave();

    return {
        code: d.util.setCode(data)
    }

}