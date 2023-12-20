module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [channelID, messageID, userID, emoji] = inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "message", {inside});

    message.reactions.cache
        .find(
            (x) =>
                x.emoji.name.toLowerCase() === emoji.toLowerCase() ||
                x.emoji.toString() === emoji.addBrackets() ||
                x.emoji.id === emoji,
        )
        ?.users.remove(userID)
        .catch((err) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                `Failed To Remove Reaction For The User:'${userID}' With Reason: ${err}`,
            );
        });

    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};
