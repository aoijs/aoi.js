module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [channelId, messageId, ...reactions] = inside.splits;
    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});
    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", {inside});
    reactions = reactions.reverse();
    for (let i = reactions.length - 1; i >= 0; i--) {
        message
            .react(reactions[i])
            .catch((err) => d.aoiError.fnError(d, "custom", {}, err.message));
    }
    return {
        code: d.util.setCode({function: d.func, code, inside, result: ""}),
    };
};
