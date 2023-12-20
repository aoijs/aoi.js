module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID, messageID, emojiResolver] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

    let emoji;

    try {
        emoji = message.reactions.cache.find((x) => x.emoji.id === d.util.getEmoji(d, emojiResolver).id)?.count;
    } catch {
        emoji = message.reactions.cache.find((x) => x.emoji.toString().toLowerCase() === emojiResolver.toLowerCase())?.count;
    } finally {
        emoji = emoji ?? 0;
    }

    data.result = emoji;

    return {
        code: d.util.setCode(data),
    };
};
