module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [channelId, messageId, userId, emoji] = inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", {inside});

    message.reactions.cache
        .find(
            (x) =>
                x.emoji.name.toLowerCase() === emoji.toLowerCase() ||
                x.emoji.toString() === emoji.addBrackets() ||
                x.emoji.id === emoji,
        )
        ?.users.remove(userId)
        .catch((err) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                `Failed To Remove Reaction For The User:'${userId}' With Reason: ${err}`,
            );
        });

    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};
