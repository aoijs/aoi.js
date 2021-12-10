module.exports = async (d) => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [channelId, messageId, emojiResolver] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel)
        return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message)
        return d.aoiError.fnError(d, "message", {inside: data.inside});

    const emoji = message.reactions.cache.find(
        (x) =>
            x.emoji.id === emojiResolver ||
            x.emoji.toString().toLowerCase() ===
            emojiResolver.addBrackets().toLowerCase(),
    );
    if (!emoji) return d.aoiError.fnError(d, "emoji", {inside: data.inside});

    data.result = emoji.count;

    return {
        code: d.util.setCode(data),
    };
};
