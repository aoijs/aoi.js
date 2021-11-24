module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [channelId, messageId, userID, reaction] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId, true);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", {inside: data.inside});

    const reactions = message.reactions.cache.find(x => x.emoji.toString() === reaction.addBrackets());

    await reactions?.users?.fetch();

    data.result = reactions?.users?.cache.has(userID);

    return {
        code: d.util.setCode(data),
    }
}