module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err)

    let [channelId, threadId, userId, reason] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId)
    if (!channel) d.aoiError.fnError(d, "channel", {inside: data.inside})

    const thread = channel.threads.cache.get(threadId);
    if (!thread) d.aoiError.fnError(d, "custom", {inside: data.inside}, "Invalid ThreadId Provided In")

    thread.members.remove(userId, reason).catch(err => d.aoiError.fnError(d, "custom", {}, `Failed To Remove The Member With Reason: ${err}`))

    return {

        code: d.util.setCode(data)

    }

}