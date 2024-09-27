/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [messageID, channel = d.channel.id] = data.inside.splits;
    channel = await d.util.getChannel(d, channel);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    message.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Message With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    }
}