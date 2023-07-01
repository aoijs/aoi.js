module.exports = async d => {
    const {code, inside, err} = d.util.aoiFunc(d);
    if (err) return d.error(err);

    let [messageID, channel = d.channel.id] = inside.splits;
    channel = await d.util.getChannel(d, channel);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "channel", {inside});

    message.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Message With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}