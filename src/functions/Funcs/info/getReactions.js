module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelId, messageId, reaction, force = "no", option = "username"] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", {inside: data.inside});

    const reactions = message.reactions.cache.find(x => x.emoji.toString() === reaction.addBrackets());

    if (force === "yes") await reactions?.users?.fetch();

    data.result = reactions?.users?.cache.map(x => option.toLowerCase() === "mention" ? x.toString() : x[option.toLowerCase()]) || "none";

    return {
        code: d.util.setCode(data),
    }
}