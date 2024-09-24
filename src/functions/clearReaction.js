/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID, messageID, userID, emoji] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

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
        code: d.util.setCode(data),
    };
};
