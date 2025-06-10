/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelId = d.channel?.id, messageId = d.message?.id] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside});

    channel.messages.endPoll(message.id);

    return {
        code: d.util.setCode(data)
    };
};