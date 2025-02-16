/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelIdFrom, messageId, channelIdTo = d.channel?.id] = data.inside.splits;
    
    const channel = d.util.getChannel(d, channelIdFrom);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });
    
    const message = await d.util.getMessage(channel, messageId);
    
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });
    
    const channelTo = d.util.getChannel(d, channelIdTo);
    if (!channelTo) return d.aoiError.fnError(d, "channel", { inside: data.inside });
    
    message.forward(channelTo).catch(e => {
      return d.aoiError.fnError(d, "custom", { inside: data.inside }, `Failed to forward message with reason: ${e.message}`);
    })

    return {
        code: d.util.setCode(data)
    }
}
