module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    let [messageId, channel = d.channel.id] = inside.splits;
    channel = await d.util.getChannel(d, channel);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "channel", {inside});

    message.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Message With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}