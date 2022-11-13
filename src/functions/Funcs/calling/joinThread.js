module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID, threadId] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const thread = channel.threads.cache.get(threadId);
    if (!thread) return d.aoiError.fnError(d, "custom", {inside: data.inside}, "Invalid ThreadId Provided In");

    thread.join()

    return {
        code: d.util.setCode(data)
    }
}