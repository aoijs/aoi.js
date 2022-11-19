module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [channelID, threadId, userID, reason] = inside.splits;
    const channel = await d.util.getChannel(d, channelID);
    if (!channel) d.aoiError.fnError(d, "channel", {inside});
    const thread = channel.threads.cache.get(threadId);
    if (!thread)
        d.aoiError.fnError(d, "custom", {inside}, "Invalid ThreadId Provided In");
    await thread.members
        .add(userID, reason)
        .catch((err) => d.aoiError.fnError(d, "custom", {}, err.message));
    return {
        code: d.util.setCode({function: d.func, inside, code}),
    };
};