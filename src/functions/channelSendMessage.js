module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID, message, returnID = "false"] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    message = await d.util.errorParser(message, d);
    if ((!message?.data && !message) || !message?.options) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Parser did not pass any data, meaning your parser usage is wrong");
    const msg = await d.aoiError.makeMessageError(d.client, channel, message?.data ?? message, message?.options, d);

    data.result = (returnID === "true" ? msg?.id : "") || "";

    return {
        code: d.util.setCode(data)
    }
}