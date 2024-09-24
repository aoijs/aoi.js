/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID, messageID, emoji = "all"] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

    if (emoji === "all") {
        message.reactions.removeAll().catch((err) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed To Remove All Reactions With Reason: " + err,
            );
        });

        return {
            code: d.util.setCode(data),
        };
    } else {
        message.reactions.cache
            .find(
                (x) =>
                    x.emoji.toString() === emoji ||
                    x.emoji.name.toLowerCase() === emoji.toLowerCase() ||
                    x.emoji.id === emoji,
            )
            ?.remove();
    }

    return {
        code: d.util.setCode(data),
    };
};
