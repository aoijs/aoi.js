module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    let [messageId, msg, channelId = d.channel.id] = inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", {inside});

    msg = await d.util.errorParser(msg, d);

    message.edit(msg).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Edit Message With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
} 