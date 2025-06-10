/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID, threadID, reason] = data.inside.splits;
    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside})

    const thread = channel.threads.cache.get(threadID);
    if (!thread) return d.aoiError.fnError(d, "custom", {inside: data.inside}, "Invalid ThreadID Provided In")

    await thread.setLocked(false, reason);

    return {
        code: d.util.setCode(data)
    }

}