module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [channelID, messageID, emoji = "all"] = inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "message", {inside});

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
            code: d.util.setCode({function: d.func, code, inside}),
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
        code: d.util.setCode({function: d.func, code, inside}),
    };
};
