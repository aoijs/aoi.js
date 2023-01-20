module.exports = async d => {
    const {code, inside, err} = d.util.aoiFunc(d);
    if (err) return d.error(err);

    let [messageID, msg, channelID = d.channel.id] = inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "message", {inside});

    msg = await d.util.errorParser(msg, d);

    message.edit(msg.data ? msg.data : msg).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Edit Message With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
} 