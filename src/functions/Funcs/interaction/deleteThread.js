module.exports = async d => {
    const {code, inside, err} = d.util.aoiFunc(d);
    if (err) return d.error(err);

    let [channelID, threadId, reason] = inside.splits;
    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside})

    const thread = channel.threads.cache.get(threadId);
    if (!thread) return d.aoiError.fnError(d, "custom", {inside}, "Invalid ThreadId Provided In")

    thread.delete(reason);

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }

}