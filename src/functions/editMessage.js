/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [messageID, msg, channelID = d.channel.id] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

    msg = await d.util.errorParser(msg, d);

    message.edit(msg?.data ? msg?.data : msg).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Edit Message With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    }
} 